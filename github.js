const axios = require('axios');

// Get the date of the most recent push to the repo (public repos only)
const getLatestPushDate = url => {
  const urlArr = url.split('/');
  if (urlArr.length !== 5) {
    return null;
  }

  const repo = urlArr.pop();
  const user = urlArr.pop();

  return axios
    .get(`https://api.github.com/repos/${user}/${repo}/events`)
    .then(res => {
      const latestPush = res.data.find(event => event.type === 'PushEvent');
      return latestPush.created_at;
    })
    .catch(err => console.log(err));
};

module.exports = getLatestPushDate;
