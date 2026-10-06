import React from 'react';

export  function CategoryDescription({desc}:{desc:string}) {
  return (
    <div className='mx-auto max-w-[760px] leading-loose text-center luca-muted'>{desc}</div>
  )
}
