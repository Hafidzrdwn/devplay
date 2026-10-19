import * as React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useThemeTokens, type SimTokens } from './useThemeTokens';

export function SceneFallback({ message }: { message?: string }) {
  return (
    <div className="flex h-full min-h-50 w-full items-center justify-center rounded-(--radius) border-2 border-(--ink) bg-(--surface) p-4 text-center font-mono text-xs text-(--muted)">
      {message ?? 'WebGL context lost or unsupported.'}
    </div>
  );
}

interface SceneErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends React.Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  override state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SceneThemeSync({ tokens }: { tokens: SimTokens }) {
  const { invalidate } = useThree();

  React.useEffect(() => {
    invalidate();
  }, [tokens, invalidate]);

  return <color attach="background" args={[tokens.bg]} />;
}

export interface ThemedEdgesProps
  extends Omit<React.ComponentProps<typeof Edges>, 'color'> {
  color?: string;
}

export function ThemedEdges({ color, ...props }: ThemedEdgesProps) {
  const tokens = useThemeTokens();
  return <Edges color={color ?? tokens.ink} {...props} />;
}

export interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  camera?: React.ComponentProps<typeof Canvas>['camera'];
  fallback?: React.ReactNode;
}

export function Scene3D({
  children,
  className,
  style,
  camera,
  fallback,
}: Scene3DProps) {
  const tokens = useThemeTokens();
  const [hasContextLost, setHasContextLost] = React.useState(false);

  const fallbackElement = fallback ?? <SceneFallback />;

  if (hasContextLost) {
    return (
      <div className={className} style={style}>
        {fallbackElement}
      </div>
    );
  }

  return (
    <SceneErrorBoundary
      fallback={
        <div className={className} style={style}>
          {fallbackElement}
        </div>
      }
    >
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '200px',
          overflow: 'hidden',
          ...style,
        }}
      >
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={camera}
          onCreated={({ gl }) => {
            const canvasElement = gl.domElement;
            const handleContextLost = (event: Event) => {
              event.preventDefault();
              setHasContextLost(true);
            };
            canvasElement.addEventListener('webglcontextlost', handleContextLost, false);
          }}
        >
          <SceneThemeSync tokens={tokens} />
          {children}
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
