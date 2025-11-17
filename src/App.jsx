import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

const sheepFlexMessage = {
  type: "flex",
  altText: "寄り添い羊が訪れました",
  contents: {
    type: "bubble",
    hero: {
      type: "image",
      url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      size: "full",
      aspectRatio: "1:1",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "寄り添い羊がそっと寄り添います",
          wrap: true,
          weight: "bold"
        },
        {
          type: "text",
          text: "深呼吸して、あたたかさを感じてね。",
          wrap: true,
          size: "sm",
          color: "#666666",
          margin: "md"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          action: {
            type: "uri",
            label: "羊からの手紙",
            uri: "https://developers.line.biz/ja/docs/messaging-api/using-flex-messages/"
          },
          color: "#7db0a6"
        }
      ]
    }
  }
};

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [sendingStatus, setSendingStatus] = useState("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID
        });

        if (!liff.isLoggedIn()) {
          setMessage("LINEへ遷移中…");
          liff.login();
          return;
        }

        setMessage("おいでませー");
        setIsReady(true);
      } catch (e) {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      }
    };

    initLiff();
  }, []);

  const handleSendSheep = async () => {
    if (!isReady) {
      return;
    }

    try {
      setSendingStatus("羊を準備中…");
      await liff.sendMessages([sheepFlexMessage]);
      setSendingStatus("羊を届けました！");
    } catch (e) {
      setSendingStatus("羊を届けられませんでした。");
      setError(`${e}`);
    }
  };

  return (
    <div className="App">
      <h1>
        ただ側にいる
        <br />
        それが寄り添い、、、
      </h1>

      {message && <p>{message}</p>}
      {sendingStatus && <p>{sendingStatus}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}

      <button className="sheep-button" onClick={handleSendSheep} disabled={!isReady}>
        羊をポップアップ表示
      </button>

      <a href="https://developers.line.biz/ja/docs/liff/" target="_blank" rel="noreferrer">
        寄り添い羊サービス（presented by パンツG）
      </a>
    </div>
  );
}

export default App;
