import data from './data'

export async function fetchStargazers(repoOrg, starCount) {
  let starsLeft = starCount;
  let cursor = null;
  let allStargazers = [];
  let userStore = {}

  while (starsLeft > 0) {
    const count = Math.min(starsLeft, 100);
    const result = await fetchPage(repoOrg, count, cursor);
    // const result = getData()
    if (!result) return result;

    const {
      user,
      result: [newCursor, page]
    } = result;
    userStore = user
    allStargazers = [...allStargazers, ...page];
    cursor = newCursor;
    if (page.length < count) {
      starsLeft = 0;
    } else {
      starsLeft = starsLeft - page.length;
    }
  }

  return { allStargazers, user: userStore };
}

function getData() {
  const { avatarUrl, followers, login, name } = data.data.user
  const { edges } = followers;
  const lastCursor = edges[edges.length - 1].cursor;
  const page = edges.map((edge) => ({
    avatarUrl: edge.node.avatarUrl,
    name: edge.node.name || edge.node.login,
  }));
  return {
    user: {
      avatarUrl,
      name,
      login
    },
    result: [lastCursor, page]
  };
}

function fetchPage(username, count, cursor) {
  // const query = `{
  //   repository(owner: "${repoOrg}", name: "${repoName}") {
  //     stargazers(first: ${count}${cursor ? `, after: "${cursor}"` : ""}) {
  //       edges {
  //         starredAt
  //         node {
  //           avatarUrl
  //           name
  //           login
  //         }
  //         cursor
  //       }
  //     }
  //   }
  // }`;
  const query = `{
    user(login: "${username}") {
      avatarUrl
      name
      login
      followers(first: ${count}${cursor ? `, after: "${cursor}"` : ""}) {
        edges {
          node {
            name
            login
            avatarUrl
          }
          cursor
        }
      }
    }
  }
`
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "token " + "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",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((textResponse) => {
          throw Error(`HTTP ${res.status} ${res.statusText}: ${textResponse}`);
        });
      }
      return res.json();
    })
    .then((res) => {
      const { avatarUrl, followers, login, name } = res.data.user
      const { edges } = followers;
      const lastCursor = edges[edges.length - 1].cursor;
      const page = edges.map((edge) => ({
        avatarUrl: edge.node.avatarUrl,
        name: edge.node.name || edge.node.login,
      }));

      return {
        user: {
          avatarUrl,
          name,
          login
        },
        result: [lastCursor, page]
      };
    })
    .catch((e) => console.error(e));
}
