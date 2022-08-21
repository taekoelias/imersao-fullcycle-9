import Document, { Html, Head, Main, NextScript } from "next/document";
import { render } from "react-dom";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="thema-color" content="#000000" />
          <link 
            rel="stylesheet" 
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
          <link 
            rel="stylesheet" 
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;