import * as React from 'react';
import {MouseEventHandler, useCallback, useEffect, useState} from 'react';
import {Drawer} from 'antd';

interface IProps {
  min: number;
  max: number;
  open: boolean;
  children: JSX.Element[];
}

const ResizableDrawer: React.FC<IProps> = ({open, children, min, max}: IProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState(min);

  const onPointerDown: MouseEventHandler = useCallback(() => {
    setIsResizing(true);
    window.addEventListener('selectstart', e => e.preventDefault());
  }, [setIsResizing]);

  const onMouseUp: EventListener = useCallback(() => {
    setIsResizing(false);
    window.removeEventListener('selectstart', e => e.preventDefault());
  }, [setIsResizing]);

  const onMouseMove: EventListener = useCallback(
    (e: MouseEventInit) => {
      if (isResizing) {
        const offsetRight =
          document.body.offsetHeight - ((e.clientY || document.body.offsetLeft) - document.body.offsetLeft);
        if (offsetRight > min && offsetRight < max) {
          setHeight(offsetRight);
        }
      }
    },
    [setHeight, isResizing, min, max]
  );

  useEffect(() => {
    if (open) {
      setHeight(max);
      return;
    }
    setHeight(min);
  }, [open]);
  useEffect(() => {
    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', onMouseUp);

    return () => {
      document.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('pointerup', onMouseUp);
    };
  });

  return (
    <Drawer
      placement="bottom"
      closable={false}
      visible
      height={height}
      mask={false}
      style={{overflow: 'hidden'}}
      bodyStyle={{overflow: 'hidden', padding: 0}}
    >
      <div
        id="draggg"
        style={{
          position: 'absolute',
          width: '100%',
          height: 5,
          padding: '4px 0 0',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          cursor: 'grab',
          backgroundColor: '#f4f7f9',
        }}
        onPointerDown={onPointerDown}
      />
      {children.map(child => React.cloneElement(child))}
    </Drawer>
  );
};

export default ResizableDrawer;
