app.init=function(){
	app.cart.init();
	app.initProfile();
	console.log('fb權杖', app.state.auth, 'stylish權杖', app.state.stylish_auth)
	let inTitle = app.get("#inTitle");
	let upTitle = app.get("#upTitle");
	inTitle.addEventListener('click', app.evts.mobileSignInStyle);
	upTitle.addEventListener('click', app.evts.mobileSignUpStyle);
	let signUpBtn = app.get('#signUpBtn');
	signUpBtn.addEventListener('click', app.evts.signUp);
	let signInBtn = app.get('#signInBtn');
	signInBtn.addEventListener('click', app.evts.signIn);
	let fbLoginBtn= app.get('#fbLoginBtn');
	fbLoginBtn.addEventListener('click', app.fb.login);
	app.get('#profileInfo').click();
};
app.initProfile=function(data){
	// 如果 FB 沒登入 → 登入註冊畫面
	if(app.state.auth===null){
		app.get("#signWrap").style.display = "flex";
		app.get("#view").style.display = "none";
	} else {
		// 有登入 → 個人資訊畫面
		app.get("#signWrap").style.display = "none";
		app.get("#view").style.display = "flex";
		
		app.showProfile(data);
	}
};
app.evts.signIn=function(e){
	e.preventDefault();
	let inFormData = new FormData(app.get('#inForm'));
	let data={
		provider:'native',
		email: inFormData.get('signInEmail'),
		password: inFormData.get('signInPw')
	}
	app.ajax("post", app.cst.API_HOST+"/user/signin", data, {}, function(req){
		let result=JSON.parse(req.responseText);
		if(result.error){
			console.log("Stylish 登入 failed", result.error);
		}else{
			console.log("Stlish 登入成功", result);
			app.state.stylish_auth = result.data.access_token;
		}
	});
}
app.evts.signUp=function(e){
	e.preventDefault();
	let upFormData = new FormData(app.get('#upForm'));
	let data={
		name: upFormData.get('signUpName'),
		email: upFormData.get('signUpEmail'),
		password: upFormData.get('signUpPw')
	}
	app.ajax("post", app.cst.API_HOST+"/user/signup", data, {}, function(req){
		let result=JSON.parse(req.responseText);
		if(result.error){
			console.log("註冊 failed", result.error);
		}else{
			console.log("註冊成功", result);
		}
	});
}
app.evts.mobileSignInStyle=function(){
	let inForm=app.get('#inForm');
		if(inForm.className === "signForm signFormGrow") {
			inForm.classList.remove('signFormGrow');
		} else {
			inForm.classList.add('signFormGrow');
		}
}
app.evts.mobileSignUpStyle=function(){
	let upForm=app.get('#upForm');
		if(upForm.className === "signForm signFormGrow") {
			upForm.classList.remove('signFormGrow');
		} else {
			upForm.classList.add('signFormGrow');
		}
}
showPanel=function(panelIndex, colorCode) {
	let tabBtns=app.getAll('.profileBtns>button');
	let panels=app.getAll('.panel');
	tabBtns.forEach(tb => {
		tb.style.backgroundColor='';
		tb.style.color='';
	});
	tabBtns[panelIndex].style.backgroundColor=colorCode;
	tabBtns[panelIndex].style.color="#8b572a";
	panels.forEach(pn => {
		pn.style.display = "none";
	});
	panels[panelIndex].style.display='block';
	panels[panelIndex].style.backgroundColor=colorCode;
}
app.showProfile=function(data){
	app.get("#profile-picture").src=`${data.picture}`;
	let details=app.get("#profile-details");
	app.createElement("div", {atrs:{
		className:"name", textContent:data.name
	}}, details);
	app.createElement("div", {atrs:{
		className:"email", textContent:data.email
	}}, details);
};
window.addEventListener("DOMContentLoaded", app.init);