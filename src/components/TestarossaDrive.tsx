import { bodyRuns, CAR_HEIGHT, CAR_WIDTH, WHEEL_SIZE, WHEELS, wheelRuns } from "../carSprite";

type TestarossaDriveProps = {
  id: number;
  direction: "ltr" | "rtl";
  onDone: () => void;
};

const body = bodyRuns();
const wheel = wheelRuns();

export function TestarossaDrive({ id, direction, onDone }: TestarossaDriveProps) {
  return (
    <div className="drive-layer" key={id}>
      <div
        className={`drive drive--${direction}`}
        onAnimationEnd={(event) => {
          if (event.animationName.startsWith("drive-")) onDone();
        }}
      >
        <div className="drive__rig">
          <div className="car__shadow" />
          <div className="car__streaks" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <svg
            className="car__sprite"
            viewBox={`0 0 ${CAR_WIDTH} ${CAR_HEIGHT}`}
            width={CAR_WIDTH * 5}
            height={CAR_HEIGHT * 5}
            shapeRendering="crispEdges"
            role="img"
            aria-label="Red Testarossa"
          >
            {body.map((run) => (
              <rect key={`b-${run.y}-${run.x}-${run.fill}`} x={run.x} y={run.y} width={run.w} height={1} fill={run.fill} />
            ))}
            {WHEELS.map((anchor) => {
              const origin = (WHEEL_SIZE - 1) / 2;
              return (
                <g key={`${anchor.cx}-${anchor.cy}`} transform={`translate(${anchor.cx - origin} ${anchor.cy - origin})`}>
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${origin} ${origin}`}
                      to={`360 ${origin} ${origin}`}
                      dur="0.28s"
                      repeatCount="indefinite"
                    />
                    {wheel.map((run) => (
                      <rect
                        key={`w-${anchor.cx}-${run.y}-${run.x}`}
                        x={run.x}
                        y={run.y}
                        width={run.w}
                        height={1}
                        fill={run.fill}
                      />
                    ))}
                  </g>
                </g>
              );
            })}
          </svg>
          <span className="car__beam" />
        </div>
      </div>
    </div>
  );
}
