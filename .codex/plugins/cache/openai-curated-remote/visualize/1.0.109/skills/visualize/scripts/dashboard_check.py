"""Validate the portable Dashboard runtime import without executing authored code."""

from __future__ import annotations

import re
from collections.abc import Callable
from html.parser import HTMLParser
from typing import NamedTuple

_DASHBOARD_MAJOR_ENTRY = "https://persistent.oaistatic.com/plugins/visualize/charts/v1/dashboard.js"
_DASHBOARD_ENTRY = re.compile(
    r"https://persistent\.oaistatic\.com/plugins/visualize/charts/"
    r"(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})/dashboard\.js"
)
_JS_TOKENS = re.compile(
    r"""//[^\r\n\u2028\u2029]*|/\*.*?(?:\*/|$)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[\w$]+|\+\+|--|[^\s]""",
    re.DOTALL,
)
_REGEXP_LITERAL = re.compile(r"/(?:\\[^\r\n]|\[(?:\\.|[^\]\\\r\n])*\]|[^/\[\\\r\n])+/[a-z]*")
_REGEXP_PREFIXES = frozenset("( [ { = , : ; ! ~ ? & | + - * > return throw case yield".split())
_IDENTIFIER = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*")
_LINE_TERMINATOR = re.compile(r"[\r\n\u2028\u2029]")
_RESERVED = frozenset(
    "await break case catch class const continue debugger default delete do else enum export extends false finally "
    "for function if import in instanceof let new null return static super switch this throw true try typeof var "
    "void while with yield implements interface package private protected public".split()
)


class _Token(NamedTuple):
    text: str
    start: int
    end: int


def validate_dashboard_import(html: str, expected_base_url: str | None = None) -> None:
    """Require an active static module import of a supported Dashboard runtime."""
    expected = (
        None if expected_base_url is None else expected_base_url.rstrip("/") + "/dashboard.js"
    )
    if expected is not None and not _supported_entry(expected):
        raise ValueError("The installed Visualize chart pin must use Charts 1.7.1 or later.")
    parser = _DashboardImportParser(expected)
    parser.feed(html)
    parser.close()
    if not parser.found:
        entry = (
            expected
            or "https://persistent.oaistatic.com/plugins/visualize/charts/<version>/dashboard.js"
        )
        raise ValueError(
            f'index.html must import the Dashboard runtime in an active module script: import "{entry}"; '
            "Use Charts 1.7.1 or later."
        )


def _supported_entry(url: str) -> bool:
    match = _DASHBOARD_ENTRY.fullmatch(url)
    return match is not None and tuple(map(int, match.groups())) >= (1, 7, 1)


def _tokens(source: str) -> list[_Token]:
    tokens: list[_Token] = []
    position = 0
    while match := _JS_TOKENS.search(source, position):
        token = match[0]
        position = match.end()
        if token.startswith(("//", "/*")):
            continue
        if token == "/" and (not tokens or tokens[-1].text in _REGEXP_PREFIXES):
            if literal := _REGEXP_LITERAL.match(source, match.start()):
                token = literal[0]
                position = literal.end()
        tokens.append(_Token(token, match.start(), position))
    return tokens


def _specifier(source: str, tokens: list[_Token], start: int) -> str | None:
    """Recognize a complete static import declaration, without evaluating JavaScript."""

    def at(index: int) -> str:
        return tokens[index].text if index < len(tokens) else ""

    def string(index: int) -> str | None:
        token = at(index)
        return (
            token[1:-1]
            if len(token) >= 2 and token[0] in ("'", '"') and token[-1] == token[0]
            else None
        )

    def identifier(index: int) -> bool:
        token = at(index)
        return _IDENTIFIER.fullmatch(token) is not None and token not in _RESERVED

    def group(index: int) -> int | None:
        if at(index) == "*":
            return index + 3 if at(index + 1) == "as" and identifier(index + 2) else None
        if at(index) != "{":
            return None
        index += 1
        locals_seen: set[str] = set()
        while at(index) != "}":
            name = at(index)
            if not identifier(index):
                return None
            index += 1
            if at(index) == "as":
                if not identifier(index + 1):
                    return None
                name = at(index + 1)
                index += 2
            if name in locals_seen:
                return None
            locals_seen.add(name)
            if at(index) == ",":
                index += 1
            elif at(index) != "}":
                return None
        return index + 1 if locals_seen else None

    index = start
    url = string(index)
    if url is None:
        index = group(index) or -1
        if index < 0 or at(index) != "from":
            return None
        index += 1
        url = string(index)
    if url is None or (
        at(index + 1) not in ("", ";")
        and not _LINE_TERMINATOR.search(source, tokens[index].end, tokens[index + 1].start)
    ):
        return None
    return url


def _imports_entry(source: str, matches: Callable[[str], bool]) -> bool:
    tokens = _tokens(source)
    depth = 0
    for index, current in enumerate(tokens):
        token = current.text
        if token in ("{", "(", "["):
            depth += 1
        elif token in ("}", ")", "]"):
            depth -= 1
        elif token == "import" and depth == 0 and _starts_statement(source, tokens, index):
            specifier = _specifier(source, tokens, index + 1)
            if specifier is not None and matches(specifier):
                return True
    return False


def _starts_statement(source: str, tokens: list[_Token], index: int) -> bool:
    if index == 0 or tokens[index - 1].text in (";", "}"):
        return True
    previous = tokens[index - 1]
    if not _LINE_TERMINATOR.search(source, previous.end, tokens[index].start):
        return False
    return (
        previous.text in (")", "]", "++", "--", "true", "false", "null", "this")
        or previous.text[0] in ("'", '"', "`", "/")
        or previous.text[0].isdigit()
        or (_IDENTIFIER.fullmatch(previous.text) is not None and previous.text not in _RESERVED)
    )


class _DashboardImportParser(HTMLParser):
    def __init__(self, expected: str | None) -> None:
        super().__init__()
        self.expected = expected
        self.found = False
        self.template_depth = 0
        self.inline_module = False

    def matches(self, url: str) -> bool:
        return url == _DASHBOARD_MAJOR_ENTRY or (
            _supported_entry(url) and (self.expected is None or url == self.expected)
        )

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in ("noscript", "textarea", "title"):
            self.set_cdata_mode(tag)
            return
        if tag == "template":
            self.template_depth += 1
        if self.found or self.template_depth or tag != "script":
            return
        # HTML uses the first occurrence of a duplicate attribute.
        attributes = dict(reversed(attrs))
        if (attributes.get("type") or "").strip().lower() != "module":
            return
        if "src" in attributes:
            self.found = self.matches((attributes["src"] or "").strip())
        else:
            self.inline_module = True

    def handle_data(self, data: str) -> None:
        if self.inline_module and not self.found:
            self.found = _imports_entry(data, self.matches)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script":
            self.inline_module = False
        elif tag == "template" and self.template_depth:
            self.template_depth -= 1
