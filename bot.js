const base = "https://graph.workplace.com/group/feed?access_token=DQVJzZAFlJWjVmVmVESDZAvQXpyYmtRcTZA3dUtyQmRTWnNqTFF6OGk3SXdKUlBkZAG9PWGxndW93dS1LSzZAIYlo0RExoY0trVXVOQ3FvX1FLT2FaNTVlSTZAmY1E4WWY1RVl6T2tZAblpSSVVzSll0Y2hKUXphbDNCYzBOZAU1lQ2JUN0xsb0dZAVFAxaF9obHZAJMFlFdkFWVE5NMHlLV0RWbGRRZAGt3ZAEFRYjhzMVlGVlVJNnBBbnhKZAlEwUzZARQmdXNjVlXzZAYVlhn&message="

async function send(msg) {
    let url = base + msg
    let cmd = await fetch(url, { method: "POST" }).then(r => r.json()).then(d => d).catch(e => console.error(e))
    return cmd
}

module.exports = { send }