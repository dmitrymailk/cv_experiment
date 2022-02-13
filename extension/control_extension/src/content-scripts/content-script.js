console.log(chrome.runtime.onMessage);

const scroll = (direction, scrollAmount) => {
  if (direction === "scroll_down") {
    window.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  } else if (direction === "scroll_up") {
    window.scrollBy({
      top: -scrollAmount,
      behavior: "smooth",
    });
  }
};

window.onload = () => {
  console.log("Hello from the content-script");

  // get message from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("ON MESSAGE", request, sender, sendResponse);
    const message_type = request["type"];
    switch (message_type) {
      case "scroll_up": {
        console.log("scroll_up");
        scroll(message_type, 10);
        break;
      }
      case "scroll_down": {
        console.log("scroll_down");
        break;
      }
      case "zoom": {
        console.log("zoom");
        scroll("scroll_down", 10);
        break;
      }
    }
  });

  //   chrome.runtime.sendMessage("{ );
};
