/**
 * comboAssociate Plugin
 *
 */
(function ($) {
	 $.fn.comboAssociate = function(settings) {
		//this - the element who calls comboAssociate() //selectCombo1
		
		if( (typeof settings.debug === 'undefined') || (settings.debug == false) ){var comboAssociateDebug = true;} 
		if(typeof settings === 'undefined'){alert('Error: comboAssociate initializing error: no settings');return false;}
		if(typeof settings.associatedCombos === 'undefined'){alert('Error: comboAssociate initializing error: no associatedCombos option on settings');return false;}
		if(settings.associatedCombos.length == 0){alert('Error: comboAssociate initializing error: settings.associatedCombos is empty');return false;}
		
		var urlIsPresent = 0;
		for (var key in settings.associatedCombos) {
			var obj = settings.associatedCombos[key];
			for (var prop in obj) {
				if(prop==='url'){
					//alert('hay url');
					urlIsPresent++;
				}
				//alert(key +'->'+ prop + " = " + obj[prop]);
			}
		}
		alert(urlIsPresent + '-' + settings.associatedCombos.length);
		if( urlIsPresent < settings.associatedCombos.length ){alert('Error: comboAssociate initializing error: no url option on any position of settings.associatedCombos');return false;}
		
		
		/* Default values to use in this plugin - don't change */
		var options = $.extend({
			//debug: false, /*no es necesrio de momento creo yo...*/	
			chooseOption: false,
			chooseOptionValue: '0',
			beforeFunction: function (object) { 
				console.log('default beforeFunction selectCombo2');
			},
			afterFunction: function (object) {
				console.log('default afterFunction selectCombo2');
			}					
        }, settings);
		
		
		if(comboAssociateDebug){console.log(options);}
		
		
		
		this.on('change', function() {
			var selectedOption = $(this).val();
			alert(selectedOption);
		});
		
		return false;
		/* //////////////////////////////comboAssociate Plugin//////////////////////////////////////////////////////// */
		
		
		
		
		
		
		$.fn.comboAssociateAjaxCall = function(customAjaxOptions) {

			var defaultOptions = { type: "POST", data: {}, dataType: "json", success: function(response){alert(response.message);}, error: function(xhr, ajaxOptions, thrownError){alert(thrownError);} };
			
			customAjaxOptions = $.extend(true,defaultOptions, customAjaxOptions);
			
			if(!customAjaxOptions.url){console.log('*****************');console.log('ERROR: FALTA URL PARA LLAMADA AJAX EN LAS OPCIONES');console.log('*****************');return false;}
			
			
			/* WARNING:......LARAVEL???*/ 
			if(!customAjaxOptions.data._token){ customAjaxOptions.data._token = "{{csrf_token()}}";}
			
			$.ajax(customAjaxOptions);	
		};
		
		//GESTIONA LOS X SELECTORES RECIBIDOS
		$.fn.gestionarSelectElemento = function(params) {
			var selectElemento = $('select#selectElemento option:selected').val();
		};
		
		/*function gestionarSelectElemento(){
            //recogemos el id del elemento seleccionado (ejemplo: id de un Hito)
            var selectElemento = $('select#selectElemento option:selected').val();
            if(selectElemento == 0){
                //deshabilitamos el boton de subida
                $("#btnUploadFile").attr("disabled", true);
                $('#contenedorInputFile').css('display', 'none');
            }else{
                //habilitamos el boton de subida
                $("#btnUploadFile").attr("disabled", false);
                $('#contenedorInputFile').css('display', 'block');
            }
            return false;
        }*/

		/* FINALLY - We return the object - It's useful when you need to chaining other jQuery functions before initializing the comboAssociate jQuery Plugin - See the docs for more info*/
		return this; 
	};
}( jQuery ));