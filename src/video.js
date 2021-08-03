import { useCurrentFrame, useVideoConfig } from "remotion";
import { RepoHeader } from "./repo-header";
import { useProgress } from "./nerd";
import { Img } from "remotion";

const W = 1280 / 2.5;
const H = 720 / 2.5;

/**
 * @typedef {{avatarUrl: string,name: string}} stargazer
 */

/**
 * 
 * @param {{stargazers: 
 * {user: { avatarUrl: string; name: string; login: string;},     allStargazers: stargazer[]; }}} some  
 */
export function Video({ username, repoName, starCount, stargazers }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const extraEnding = 1 * fps;

  const progress = useProgress(
    frame,
    durationInFrames - extraEnding,
    stargazers.allStargazers.length,
    fps
  );

  return (
    <Content
      stargazers={stargazers.allStargazers}
      username={username}
      repoName={stargazers.user}
      progress={progress}
    />
  );
}

/**
 * @param {{stargazers: stargazer[]}} some
 */
function Content({ stargazers, username, repoName, progress }) {
  const gap = 102;
  const startY = 76 - gap;
  const dy = progress * gap;
  const { width } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f6f8fa",
        position: "relative",
        maxWidth: W,
        maxHeight: H,
        transformOrigin: "top left",
        transform: `scale(${width / W})`,
      }}
    >
      {stargazers.map((stargazer, index) => {
        const isHidden = Math.abs(index - progress) > 3;
        // const grow =
        //   index + 1 > progress ? 1 : Math.max(0, index + 2 - progress);
        const grow = 0;
        const opacity = Math.min(0.1 + progress - index, 1);
        return isHidden ? null : (
          <StarBox
            avatarUrl={stargazer.avatarUrl}
            name={stargazer.name}
            repoName={repoName.name}
            y={startY - gap * index + dy}
            grow={grow}
            opacity={opacity}
            key={stargazer.name}
            starNumber={index + 1}
          />
        );
      })}

      <RepoHeader stars={Math.round(progress)} login={repoName.login} avatarUrl={repoName.avatarUrl} name={repoName.name} />
    </div>
  );
}

function StarBox({
  avatarUrl,
  name,
  repoName,
  y,
  starNumber,
  grow,
  opacity,
}) {
  return (
    <div
      style={{
        // margin: "24px",
        background: "white",
        border: "1px solid #e1e4e8",
        borderRadius: 6,
        padding: 12,
        display: "flex",
        position: "absolute",
        opacity,
        top: 0,
        right: 24,
        left: 24,
        transform: `translateY(${y}px) scale(${1 + grow * 0.07})`,
      }}
    >
      <Img
        width="64"
        height="64"
        src={avatarUrl}
        style={{ borderRadius: "50%" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "12px",
          flex: 1,
          maxWidth: 560,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 360,
            fontWeight: 400,
          }}
        >
          {name}
        </h3>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Followed <b>{repoName}</b>{" "}
          <span style={{ color: "#586069" }}>on someday.</span>
        </div>
      </div>
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.8em", color: "#586069" }}>Follower</span>
        <div style={{ fontSize: "1.2em" }}>
          <span style={{ fontSize: "1em", color: "#586069" }}>#</span>
          {starNumber}
        </div>
      </div>
    </div>
  );
}
