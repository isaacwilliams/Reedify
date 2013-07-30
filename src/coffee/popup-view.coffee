class PopupView
	template:null
	animationShow:'popup-show'
	animationHide:'popup-hide'
	
	constructor:()->
		@$el = $ @template( this )
	
	showPopup:(callback)->
		@$el.animate animationShow,
			duration:250
			easing:'ease-in-out'
			complete:()-> 
				if callback then callback()
	
	hidePopup:(callback)->
		@$el.animate animationHide,
			duration:250
			easing:'ease-in-out'
			complete:()-> 
				complete:()-> 
					@$el.remove()
					if callback then callback()
					
class LoginPopupView extends PopupView
	
	