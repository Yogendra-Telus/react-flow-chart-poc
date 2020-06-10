import * as React from "react";
import "font-awesome/css/font-awesome.min.css";
import {
  generateCurvePath,
  generateRightAnglePath,
  generateSmartPath,
  IConfig,
  ILink,
  IOnLinkClick,
  IOnLinkMouseEnter,
  IOnLinkCancel,
  IOnLinkMouseLeave,
  IPort,
  IPosition,
} from "../../";

export interface ILinkDefaultProps {
  config: IConfig;
  link: ILink;
  startPos: IPosition;
  endPos: IPosition;
  fromPort: IPort;
  toPort?: IPort;
  onLinkMouseEnter: IOnLinkMouseEnter;
  onLinkMouseLeave: IOnLinkMouseLeave;
  onLinkClick: IOnLinkClick;
  onRemoveLink: IOnLinkCancel;
  isHovered: boolean;
  isSelected: boolean;
  matrix?: number[][];
}

const imageSrc =
  "https://lh6.ggpht.com/5I4BgwoxVAZH5vcPXwdjuNQ6Ellx9YCGgOYif7o2rMwJ2X7sCV96CqXy3OG4XCfwwhGm2C4=w20";
export const LinkDefault = ({
  config,
  link,
  startPos,
  endPos,
  fromPort,
  toPort,
  onLinkMouseEnter,
  onLinkMouseLeave,
  onLinkClick,
  onRemoveLink,
  isHovered,
  isSelected,
  matrix,
}: ILinkDefaultProps) => {
  const points = config.smartRouting
    ? !!toPort && !!matrix
      ? generateSmartPath(matrix, startPos, endPos, fromPort, toPort)
      : generateRightAnglePath(startPos, endPos)
    : generateCurvePath(startPos, endPos);

  const linkColor: string =
    (fromPort.properties && fromPort.properties.linkColor) || "cornflowerblue";

  // @ts-ignore
  const onRemoveConnection = (link) => {
    //window.alert(`Connection remove request for "${link.link.properties.label}"`)
    onRemoveLink(link);
  };

  return (
    <svg
      style={{
        overflow: "visible",
        position: "absolute",
        cursor: "pointer",
        left: 0,
        right: 0,
      }}
    >
      <circle r="4" cx={startPos.x} cy={startPos.y} fill={linkColor} />
      {/* Main line */}
      <path d={points} stroke={linkColor} strokeWidth="3" fill="none" />
      {/* Thick line to make selection easier */}
      <path
        d={points}
        stroke={linkColor}
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeOpacity={isHovered || isSelected ? 0.1 : 0}
        onMouseEnter={() => onLinkMouseEnter({ config, linkId: link.id })}
        onMouseLeave={() => onLinkMouseLeave({ config, linkId: link.id })}
        onClick={(e) => {
          onLinkClick({ config, linkId: link.id });
          e.stopPropagation();
        }}
      />
      {isSelected && (
        <image
          xlinkHref={imageSrc}
          onClick={() => onRemoveConnection({ config, link, linkId: link.id })}
          x={(startPos.x + endPos.x) / 2}
          y={(startPos.y + endPos.y) / 2}
          height="30px"
          width="30px"
        />
      )}
      <circle r="4" cx={endPos.x} cy={endPos.y} fill={linkColor} />
    </svg>
  );
};
