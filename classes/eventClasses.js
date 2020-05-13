module.exports = {
  handleLinkRequest: async (data, socket) => {
    let linkId = data.linkId;
    let courseData = await common.getCourseData(linkId);
    if (courseData) {
      let time = await common.addSeconds(new Date(), config.seconds);
      var jobId = Math.random().toString(36).substring(5);
      common.sendDataToUser(socket, {
        en: "linkResp",
        data: {
          waitTime: config.seconds,
          headerData: courseData.headerData ? courseData.headerData : {},
        },
        err: 0,
      });
      schedule.scheduleJob(jobId, time, function () {
        // console.log("schedule Executed", courseData);
        schedule.cancelJob(jobId);
        common.sendDataToUser(socket, {
          en: "linkData",
          data: courseData,
          err: 0,
        });
      });
    } else {
      common.sendDataToUser(socket, { en: "invalidLink", data: {}, err: 1 });
    }
  },
  register: async (data, socket) => {
    if (data.userName && !userNames.includes(data.userName)) {
      users[userName] = socket.id;
      common.sendDataToUser(socket, {
        users: userNames,
        msg: "user Registered",
      });
      return;
    } else {
      common.sendDataToUser(socket, {
        msg: "userName missing || already Exist",
      });
      return;
    }
  },
  sendMessage: async (data, socket) => {
    if (data.userName && data.msg && usernames.includes(data.userName)) {
      common.sendBySocketId(users[data.userName], {
        userMsg: data.msg,
        msg: "user message",
        from: users[socket.id],
        to: users[data.userName],
      });
      common.sendDataToUser(socket, {
        userMsg: data.msg,
        msg: "user message",
        from: users[socket.id],
        to: users[data.userName],
      });
      return;
    } else {
      common.sendDataToUser(socket, {
        msg: "userName missing || username dosent exists || msg is blank",
      });
      return;
    }
  },
};
