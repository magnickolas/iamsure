# Iamsure

Chrome extension asks if you sure wanna get distracted on specific domains.

<p align="center">
  <a href="https://github.com/magnickolas/iamsure">
    <img src="https://oplachko.com:500/uploads/upload_9b736d6264afa4eca62f1141ba71d53a.png" width="45%">
  </a>
</p>

## Installation

You can install the latest version from the [Chrome Web Store](https://chrome.google.com/webstore/detail/iamsure/phhajghcggocknlgkjhpbnjckcbebnfj).

### Installation from source

- Go to `chrome://extensions`
- Turn `Developer mode` on
- Click `Load unpacked` and load `app` folder

## Configuration

In the extension's settings you can write multiple lines with simple globs to include or exclude different urls.  
Examples:
- `*github.com*` to include urls containing `github.com`
- `-*github.com/magnickolas*` to exclude urls containing `github.com/magnickolas`


**Iamsure** will ask you on a webpage with a matching url when it loads — whether to stay on it or close the tab.
