const base = "https://graph.workplace.com/group/feed?access_token=DQVJ0cmJTdWZAhTXNOdWV2SHdrSGZAONmp0MFVhOVpTb2V2U2c2U1RTRjFiX3BSTzhCWF8wZAW8yYk94cmNpM2pGdWlIT3k0c1JOTHBYc0wxV1lORy1YVjJGTi1LR1IwNXNvMGFjNXd1Y1B3MEtNT0tvWEd4MWhnUGlLN0w5N3FCOVRTaGduRXRISFdFei1KbFF3cTZAlckZARS0hCMUhzaEhqU0ZAFWDVMMEw5V3dYWWY3YXFjUkd4ajRJM3pVWlFYYW5HczV4dldn&message="

function send(msg) {
    let url = base + msg
    fetch(url, { method: "POST" }).catch(err => console.log(err))
}

module.exports = { send }