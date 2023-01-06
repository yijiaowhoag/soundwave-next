import ReactDOM from 'react-dom';
import { useRef, useEffect } from 'react';

interface PortalProps {
  children: React.ReactNode;
  toggleModal?: () => void;
}

const Portal: React.FC<PortalProps> = ({ children, toggleModal }) => {
  const containerEl = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    const root: HTMLElement | null = document.getElementById('modal-root');
    const el: HTMLDivElement = document.createElement('div');

    containerEl.current = el;
    root?.appendChild(el);

    return () => {
      root && el && root.removeChild(el);
    };
  }, []);

  return (
    (containerEl.current &&
      ReactDOM.createPortal(children, containerEl.current)) ||
    null
  );
};

export default Portal;
