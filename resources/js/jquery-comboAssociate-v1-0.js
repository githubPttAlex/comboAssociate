/**
 * comboAssociate Plugin
 *
 */
(function ($) {
        $.fn.comboAssociate = function(settings) {
            //this - the element who calls comboAssociate() //selectCombo1
            
            var comboAssociateDebug = true;
            if( (typeof settings.debug === 'undefined') || (settings.debug == false) ){var comboAssociateDebug = false;} 
            if(typeof settings === 'undefined'){alert('Error: comboAssociate initializing error: no settings');return false;}
            if(typeof settings.associatedCombos === 'undefined'){alert('Error: comboAssociate initializing error: no associatedCombos option on settings');return false;}
            
            var urlIsPresent = 0;
            var countElements = 0;  
            for (var key in settings.associatedCombos) {  
                countElements++;
                var obj = settings.associatedCombos[key];
                for (var prop in obj) {
                    //alert(key +'->'+ prop + " = " + obj[prop]);
                    if(prop==='url'){
                        //alert('hay url');
                        urlIsPresent++;
                    }
                }
            }
            
            
            if(countElements == 0){alert('Error: comboAssociate initializing error: settings.associatedCombos is empty');return false;}
            if( urlIsPresent < countElements){alert('Error: comboAssociate initializing error: no url option on any position of settings.associatedCombos');return false;}


            /* Default values to use in this plugin - don't change */
            var options = $.extend({
                //debug: false, /*no es necesrio de momento creo yo...*/	
                chooseOption: false,
                chooseOptionValue: '0',
                onChange: function (object) { 
                    console.log('default onChange');
                },
                beforeFunction: function (object) { 
                    console.log('default beforeFunction');
                },
                afterFunction: function (object) {
                    console.log('default afterFunction');
                }					
            }, settings);

            if(comboAssociateDebug){console.log(options);}
            
            
            this.on('change', function() {
                var selectedOption = $(this).val();

                for (var key in settings.associatedCombos) {
                    console.log('key:' + key);
                    console.log(mainObjectSelector);

                    var urlOptionElement = settings.associatedCombos[key].url;
                    var chooseOptionOptionElement = settings.associatedCombos[key].chooseOption;
                    var chooseOptionValueOptionElement = settings.associatedCombos[key].chooseOptionValue;
                    var chooseOptionTextOptionElement = settings.associatedCombos[key].chooseOptionText;
                    
                    var dataAjax = {};
                    dataAjax.id = selectedOption;
                    //dataAjax._token = "{{csrf_token()}}";   
                    
                    var ajaxOptions = {
                        type: "POST",
                        url: urlOptionElement,
                        dataType: 'json',   
                        data : dataAjax,
                        success: function (response) {
                            console.log(response);
                            console.log('hacemos empty de:'+key);
                            $(key).empty();
                            
                            var strOptions = '';   
                            if(chooseOptionOptionElement){
                                strOptions += '<option value="' + chooseOptionValueOptionElement + '" selected>' + chooseOptionTextOptionElement + '</option>';
                            }
                            
                            $.each(response, function(responseKey, responseValue) {
                                strOptions += '<option value="'+responseKey+'" >'+responseValue+'</option>';
                            });
                            $(key).html(strOptions);
                        },
                        error: function (request, status, error) {
                            console.log(request.responseText);
                        } 
                    };
                    comboAssociateAjaxCall(ajaxOptions);
                    //settings.associatedCombos['select#selectCombo2'].onChange.call();


                }
            });
            
            
            /* //////////////////////////////comboAssociate Plugin//////////////////////////////////////////////////////// */
            //GESTIONA LOS X SELECTORES RECIBIDOS
            /*$.fn.gestionarSelectElemento = function(params) {
                    var selectElemento = $('select#selectElemento option:selected').val();
            };*/
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
       

       
        function comboAssociateAjaxCall(customAjaxOptions){
           var defaultOptions = { type: "POST", data: {}, dataType: "json", success: function(response){alert(response.message);}, error: function(xhr, ajaxOptions, thrownError){alert(thrownError);} };
           customAjaxOptions = $.extend(true,defaultOptions, customAjaxOptions);
           if(!customAjaxOptions.url){console.log('*****************');console.log('ERROR: FALTA URL PARA LLAMADA AJAX EN LAS OPCIONES');console.log('*****************');return false;}

           /* WARNING:......LARAVEL???*/ 
           //if(!customAjaxOptions.data._token){ customAjaxOptions.data._token = "{{csrf_token()}}";}
           $.ajax(customAjaxOptions);	
        }
}( jQuery ));