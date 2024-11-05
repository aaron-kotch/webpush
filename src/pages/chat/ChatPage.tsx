import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatController, useChat } from "./controller/useChatController";
import { Box1 } from "iconsax-react";
import { Button } from "@/components/ui/button";

export const ChatPage = () => {
  return (
    <ChatController>
      <Screen />
    </ChatController>
  );
};

const Screen = () => {
  const { handleSubmit } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // const VAPID_PUBLIC =
  //   "BMwXGw7kP3iT1K14ynMThF7tc7vd430DT4OvR8KYS1EFfTzVerqB9qH0FU-LY_rPa44ABD6dFmNykct1yIxQfHQ";

  const [permission, setPermission] = useState<any>("default");
  const [_registration, _setRegistration] = useState<any>(null);

  useEffect(() => {
    // Check if notifications are supported
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (err) {
      console.error("Error requesting permission:", err);
    }
  };

  // const sendMockNotification = () => {
  //   if (!registration || permission !== "granted") return;

  //   // Create mock push event
  //   const mockPushEvent = new MessageEvent("push", {
  //     data: {
  //       json: () => ({
  //         title: "AWS SNS Notification",
  //         message: `Test notification sent at ${new Date().toLocaleTimeString()}`,
  //       }),
  //     },
  //   });

  //   console.log("mockPushEvent", mockPushEvent);

  //   // Dispatch the event to the service worker
  //   registration.active.postMessage({
  //     type: "MOCK_PUSH",
  //     title: "AWS SNS Notification",
  //     message: `Test notification sent at ${new Date().toLocaleTimeString()}`,
  //   });

  //   // Fallback: If service worker doesn't respond, show notification directly
  //   new Notification("AWS SNS Notification", {
  //     body: `Test notification sent at ${new Date().toLocaleTimeString()}`,
  //     icon: "/icon.png",
  //     badge: "/badge.png",
  //   });
  // };

  const showMockNotification = () => {
    const now = new Date().toLocaleTimeString();

    if (Notification.permission === "granted") {
      const options = {
        body: `Mock message at ${now}`,
        icon: "https://via.placeholder.com/48",
        tag: "mock-notification", // Used to replace existing notifications with the same tag
      };
      new Notification("Mock Notification", options);
    } else {
      alert("Notification permissions are not granted.");
    }
  };

  // Public Key
  // BBcOjwMEFIJTI_5eS7CIMMs0e-xg-UZthlyI7QFWPkj-GnenhU7Q5V3x37-yVRhnEx5wROtrxLmgJSSOyraly30

  // Private Key
  // rd7E5f-QQYnsnajDgvBwsSrFjViVaTFqbFPPfqZSdQY

  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // create a push listener
  self.addEventListener("push", function (event: any) {
    if (event.data) {
      console.log("This push event has data: ", event.data.text());
    } else {
      console.log("This push event has no data.");
    }
  });

  const sub = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/fFzjn4gLbMc:APA91bHM6QabiMTVm5vv7LNv9CLZG3LKYq1Z5wb6PAMe0HC5G5et1ZlYY3HuGmsHkbLYG8dqhcjjp_ZqvB9ucvNavw77Ehs3bmLbH4XURRn9y_yUCr0sESWoPE7Z4SF6vYmGJkR_BpBV",
    expirationTime: null,
    keys: {
      p256dh:
        "BP97UJY9cP139QatV9Gjp0FgCgDFHSDCXNSO4IgctnN9AVx1O0x4AMSKOhciO5i_YZ6kzhu6IYfg9C8Us2Qf_34",
      auth: "b2_ht1_aYskqXKdcN7Nxtg",
    },
  };

  console.log("sub", sub);

  function subscribeUserToPush() {
    return navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BBcOjwMEFIJTI_5eS7CIMMs0e-xg-UZthlyI7QFWPkj-GnenhU7Q5V3x37-yVRhnEx5wROtrxLmgJSSOyraly30"
          ),
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function (pushSubscription) {
        console.log(
          "Received PushSubscription: ",
          JSON.stringify(pushSubscription)
        );
        return pushSubscription;
      });
  }

  return (
    <div className="fixed inset-0 flex flex-col items-start justify-center gap-6 w-full h-full min-w-[400px] max-w-screen-xl p-10 bg-[#f8f8f8]">
      <ChatList />

      {permission === "default" && (
        <Button
          onClick={requestPermission}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enable Notifications
        </Button>
      )}

      {permission === "granted" && (
        <>
          <Button
            onClick={() => {
              showMockNotification();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send Test Notification
          </Button>
          <Button
            onClick={() => {
              subscribeUserToPush();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Subscribe to push
          </Button>
        </>
      )}

      {permission === "denied" && (
        <div className="text-red-500">
          Notifications are blocked. Please enable them in your browser
          settings.
        </div>
      )}

      <div className="w-full flex flex-row items-start ">
        <form onSubmit={handleSubmit} className="w-full">
          <Input
            ref={inputRef}
            className="font-mono border-0 focus-visible:ring-0 rounded-none px-1 text-lg w-full"
            placeholder="Your text here"
            name="query"
          />
        </form>
      </div>
    </div>
  );
};

const ChatList = () => {
  const { messages } = useChat();

  const reversedMessages = [...messages].reverse();

  return (
    <div className="flex flex-col-reverse gap-4 w-full h-full overflow-y-auto">
      {reversedMessages?.map((message, index) => {
        let processedMessage = "";
        let products = [];

        if (message?.content?.length) {
          processedMessage = message.content[0].text;
          products = message.content[0].products;
        }

        // const componentContent = getXmlTagContent(processedMessage, "input");
        // const stringWithoutComponents = removeXmlTags(
        //   processedMessage,
        //   "input"
        // );

        console.log("products", products);

        return (
          <div key={index}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              className={`prose prose-strong:text-black font-mono ${
                message.role === "assistant"
                  ? "font-normal text-black"
                  : "font-normal text-blue-600 justify-self-end"
              }`}
            >
              {processedMessage}
            </Markdown>
            <div className="mt-4 flex flex-col gap-2 w-fit">
              {products?.map((product: any, index: number) => {
                const { name, currency, quantity, price } = product;

                return (
                  <div
                    key={index}
                    className="text-sm flex flex-row items-center justify-start gap-2 border-[1px] w-full p-2 rounded-md  shadow-sm"
                  >
                    {/* <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20"
                    /> */}
                    <Box1 size="20" color="#FF8A65" variant="Bulk" />
                    <p className="font-mono font-medium mr-auto">
                      {name} x {quantity}
                    </p>
                    <p className="justify-self-end min-w-[100px] text-end">
                      {currency} {price.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
