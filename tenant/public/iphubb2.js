function FLOOD3(type, cat) {
  const flDiv = document.body.appendChild(document.createElement("div"));
  const cachebust = Math.random() * 10000000000000000;
  flDiv.setAttribute("id", "DCLK_FLDiv1");
  flDiv.style.position = "absolute";
  flDiv.style.top = "0";
  flDiv.style.left = "0";
  flDiv.style.width = "1px";
  flDiv.style.height = "1px";
  flDiv.style.display = "none";
  flDiv.innerHTML =
    '<iframe id="DCLK_FLIframe1" src="https://3689183.fls.doubleclick.net/activityi;src=3689183;type=' +
    type +
    ";cat=" +
    cat +
    ";dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1;num=" +
    cachebust +
    '?" width="1" height="1" frameborder="0"></iframe>';
}
