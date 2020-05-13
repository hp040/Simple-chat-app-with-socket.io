module.exports = {
  bindEventToSocket: (en, data, socket) => {
    console.log(en, data);

    switch (en) {
      case "handleLinkRequest":
        eventClasses[en](data, socket);
        break;
      case "register":
        eventClasses[en](data, socket);
        break;
      case "createGroup":
        eventClasses[en](data, socket);
        break;
      default:
        console.log("event Not Found");
    }
  },
};
