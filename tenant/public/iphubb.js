var axel = Math.random() + "";
var a = axel * 10000000000000;
const div = document.createElement('div');
div.innerHTML = '<iframe src="https://3689183.fls.doubleclick.net/activityi;src=3689183;type=dossi0;cat=lpbis;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1;num=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>'.trim();
const element = document.getElementById("app");
element.appendChild(div);