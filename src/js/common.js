    function setCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString()+ "; path=/";
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    function eraseCookie(key) {
        var keyValue = getCookie(key);
        setCookie(key, keyValue, '-1');
    }

	function hasLowerCase(str) {
		for(let i = 0; i < str.length; i++){
			if(/[a-z]/.test(str.charAt(i))){          
				return true;
			}
		}	
		return false;		
	}	

	function hasUpperCase(str) {
		for( let i = 0; i < str.length; i++){
			if(/[A-Z]/.test(str.charAt(i))){          
				return true;
			}
		}	
		return false;		
	}	
	
	function hasNumber(str){	
		for( let i = 0; i < str.length; i++){
			if(!isNaN(str.charAt(i))){          
				return true;
			}
		}	
		return false;
	}	

	function hasSpecialCharacter(str){	
		for( let i = 0; i < str.length; i++){
			if(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str.charAt(i))){         
				return true;
			}
		}	
		return false;
	}	