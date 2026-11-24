(() => {
  let documentState = window.openai?.sandboxDocumentState;
  // Pinned grids also disable native selection and scrolling on block headings.
  const headerStyle = new CSSStyleSheet();
  headerStyle.replaceSync(`
    [data-dashboard-direct-editing] > :is(experimental-dash-block, dash-block)::part(header) {
      touch-action: auto;
      user-select: auto;
    }
  `);
  document.adoptedStyleSheets.push(headerStyle);

  function connect(grid) {
    let content = window.openai?.widgetState?.modelContent ?? null;
    let generation = 0;
    let pending;
    let queued = 0;

    function canMergeLayout() {
      return (
        content == null ||
        (typeof content === "object" &&
          !Array.isArray(content) &&
          (!Object.hasOwn(content, "layout") || Array.isArray(content.layout)))
      );
    }

    function restoreLayout() {
      grid.layout = Array.isArray(content?.layout) ? content.layout : [];
    }

    function syncMode() {
      grid.active =
        !document.hidden && documentState?.dashboardVisible !== false;
      grid.editable =
        grid.active &&
        documentState?.dashboardEditMode === true &&
        canMergeLayout();
      grid.toggleAttribute(
        "data-dashboard-direct-editing",
        grid.editable && documentState?.dashboardDirectEditing === true,
      );
    }

    function receiveState(state) {
      // The SDK echoes this exact object before the host accepts the write.
      if (
        state === pending ||
        (state != null && !Object.hasOwn(state, "modelContent"))
      )
        return;
      generation++;
      content = state?.modelContent ?? null;
      restoreLayout();
      syncMode();
    }

    function changed(event) {
      const layout = event.detail?.layout;
      if (
        event.target !== grid ||
        !grid.editable ||
        !Array.isArray(layout) ||
        layout === content?.layout
      ) {
        return;
      }
      // An authored listener can save its own state. The SDK echoes that write
      // synchronously. Wait for those listeners before providing the default.
      const observed = generation;
      const latest = ++queued;
      queueMicrotask(() => {
        if (
          latest === queued &&
          observed === generation &&
          grid.editable &&
          canMergeLayout()
        ) {
          void reportLayout(layout);
        }
      });
    }

    async function reportLayout(layout) {
      const current = ++generation;
      const state = { modelContent: { ...content, layout } };
      pending = state;
      try {
        await window.openai.setWidgetState(state);
        if (current === generation) {
          content = state.modelContent;
        }
      } catch {
        if (current === generation) {
          restoreLayout();
        }
      } finally {
        if (pending === state) {
          pending = undefined;
        }
      }
    }

    // Pinned grids can start a move anywhere on a block. In direct editing,
    // leave the grid enabled for its controls and let other presses reach the
    // original target with the same behavior as viewing the Dashboard.
    let restoreEditing;
    function pressContent(event) {
      if (
        !documentState?.dashboardDirectEditing ||
        !grid.editable ||
        event.button !== 0 ||
        !event.isPrimary
      )
        return;
      const path = event.composedPath();
      const block = path.find(
        (node) => node instanceof Element && node.parentElement === grid,
      );
      if (
        !block ||
        path.some(
          (node) =>
            node instanceof Element &&
            node.parentElement === block &&
            node.slot === "layout-controls",
        )
      )
        return;
      grid.editable = false;
      restoreEditing = setTimeout(syncMode, 0);
    }
    grid.addEventListener("pointerdown", pressContent, true);

    function disconnect() {
      generation++;
      grid.active = false;
      grid.editable = false;
      grid.removeAttribute("data-dashboard-direct-editing");
      clearTimeout(restoreEditing);
      grid.removeEventListener("pointerdown", pressContent, true);
      window.removeEventListener("layoutchange", changed, true);
    }

    window.addEventListener("layoutchange", changed, true);
    restoreLayout();
    return { grid, syncMode, receiveState, disconnect };
  }

  const names = ["experimental-dash-layout", "dash-layout"];
  const selector = names.map((name) => name + ":defined").join(",");
  let binding;
  let reported = false; // A new host session starts with Edit hidden.
  let stopped = false;

  async function sync() {
    binding?.syncMode();
    if (document.hidden || documentState?.dashboardVisible === false) {
      reported = undefined; // The host ignores inactive guests. Re-report on return.
      return;
    }
    const available = binding?.grid.getRootNode() === document;
    if (available === reported || !window.openai?.callTool) return;
    reported = available;
    try {
      await window.openai.callTool("__codex_dashboard_layout_availability__", {
        available,
      });
    } catch {
      // Older hosts do not consume this UI signal.
    }
  }

  function bind(grid) {
    if (grid !== binding?.grid) {
      binding?.disconnect();
      binding = grid && connect(grid);
    }
    observer.disconnect();
    if (grid) {
      // Only removal or reparenting matters. Updates inside a chart cannot wake this observer.
      for (let parent = grid.parentNode; parent; parent = parent.parentNode) {
        observer.observe(parent, { childList: true });
      }
    } else {
      observer.observe(document, { childList: true, subtree: true });
    }
    void sync();
  }

  function findGrid() {
    if (stopped) return;
    const grid = binding?.grid;
    bind(
      grid?.getRootNode() === document
        ? grid
        : document.querySelector(selector),
    );
  }

  const observer = new MutationObserver((records) => {
    if (binding) {
      findGrid();
      return;
    }
    // Until a grid mounts, search just the inserted subtrees.
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element) || node.getRootNode() !== document)
          continue;
        const candidate = node.matches(selector)
          ? node
          : node.querySelector(selector);
        if (candidate) {
          bind(candidate);
          return;
        }
      }
    }
  });

  function receive(event) {
    const globals = event.detail?.globals;
    if (!globals) return;
    if ("sandboxDocumentState" in globals) {
      const previous = documentState;
      documentState = globals.sandboxDocumentState;
      void sync();
      if (
        previous?.dashboardDirectEditing &&
        documentState?.dashboardDirectEditing &&
        documentState.dashboardFocusRequest > 0 &&
        documentState.dashboardFocusRequest !== previous.dashboardFocusRequest &&
        binding?.grid.editable
      ) {
        // Focusing the host frame alone does not enter the nested Page's tab order.
        if (!document.body.hasAttribute("tabindex")) document.body.tabIndex = -1;
        window.focus();
        document.body.focus({ preventScroll: true });
      }
    }
    if ("widgetState" in globals) binding?.receiveState(globals.widgetState);
  }

  function hide(event) {
    reported = undefined;
    if (event.persisted) return;
    stopped = true;
    observer.disconnect();
    binding?.disconnect();
    binding = null;
    window.removeEventListener("openai:set_globals", receive);
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("pageshow", sync);
    window.removeEventListener("pagehide", hide);
  }

  window.addEventListener("openai:set_globals", receive);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pageshow", sync);
  window.addEventListener("pagehide", hide);
  // Static dashboards need no DOM observer. Start watching only after a supported
  // module has actually registered its custom element in this guest.
  for (const name of names)
    void customElements.whenDefined(name).then(findGrid);
})();
