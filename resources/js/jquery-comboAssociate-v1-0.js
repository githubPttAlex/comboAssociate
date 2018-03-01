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

            if(typeof settings.associatedCombos !== 'undefined'){
                console.log('if');
                //alert('Error: comboAssociate initializing error: no associatedCombos option on settings');return false;
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
                    var requests = [];
                    var nestedFunctions = {};

                    for (var key in settings.associatedCombos) {
                        console.log('key:' + key);

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
                            data : dataAjax
                        };
                        var processAjax = ca_AjaxCall(ajaxOptions); 
                        requests.push(processAjax); 
                        nestedFunctions.myfunction = function(element, response) {
                            $(element).empty(); 
                            var strOptions = '';   
                            if(chooseOptionOptionElement){
                                strOptions += '<option value="' + chooseOptionValueOptionElement + '" selected>' + chooseOptionTextOptionElement + '</option>';
                            }
                            $.each(response, function(responseKey, responseValue) {
                                strOptions += '<option value="'+responseKey+'" >'+responseValue+'</option>';
                            });
                            $(element).html(strOptions);
                        };
                        //settings.associatedCombos['select#selectCombo2'].onChange.call();
                    }
                    //console.log(nestedFunctions);

                    $.when.apply($, requests).done(function(){
                        console.log('done');
                        console.log(arguments);
                        console.log(arguments[0][0] + arguments[0][1] + arguments[0][2] ); 
                        console.log(arguments[1][0] + arguments[1][1] + arguments[1][2] ); 

                        ca_ManageResponses(nestedFunctions, arguments, settings.associatedCombos);



                        //settings.associatedCombos['select#selectCombo2'].afterFunction.call();

                    }).fail(function(){
                        console.log('fail');
                        console.log(arguments);
                    });       
                });
                
                
                
            }else{
                
                console.log('else'); 
               
                
                var comboId = '#' + this.attr('id');
                var selectedOption = $(this).val();
                var requests = [];
                var nestedSingleFunctions = {};
                var urlOptionElement = settings.url;
                var chooseOptionOptionElement = settings.chooseOption;
                var chooseOptionValueOptionElement = settings.chooseOptionValue;
                var chooseOptionTextOptionElement = settings.chooseOptionText;
                
//                alert(chooseOptionOptionElement);
//                alert(chooseOptionValueOptionElement);
//                alert(chooseOptionTextOptionElement);

                var dataAjax = {};
                dataAjax.id = selectedOption;
                //dataAjax._token = "{{csrf_token()}}";   

                var ajaxOptions = {
                    type: "POST",
                    url: urlOptionElement,
                    dataType: 'json',   
                    data : dataAjax
                };
                var processAjax = ca_AjaxCall(ajaxOptions); 
                requests.push(processAjax); 
                nestedSingleFunctions.caFunctionSingle = function(element, response) {
                    $(element).empty(); 
                    var strOptions = '';   
                    if(chooseOptionOptionElement){
                        strOptions += '<option value="' + chooseOptionValueOptionElement + '" selected>' + chooseOptionTextOptionElement + '</option>';
                    }
                    $.each(response, function(responseKey, responseValue) {      
                        strOptions += '<option value="'+responseKey+'" >'+responseValue+'</option>';
                    });
                    $(element).html(strOptions);
                };
 
                $.when.apply($, requests).done(function(){
                    console.log('done');
                    ca_ManageResponses_single(nestedSingleFunctions, arguments, comboId);
                    //settings.associatedCombos['select#selectCombo2'].afterFunction.call();

                }).fail(function(){
                    console.log('fail');
                    console.log(arguments);
                });
                
                this.on('change', function() {
                    settings.onChange.call();
                });

                
            }
            
            
            /* FINALLY - We return the object - It's useful when you need to chaining other jQuery functions before initializing the comboAssociate jQuery Plugin - See the docs for more info*/
            return this; 
        };
       
        function ca_ManageResponses(nestedFunctions, response, associatedCombos){
            var index= 0;
            for (var key in associatedCombos) { 

                nestedFunctions.myfunction(key, response[index][0]); //.call(element, arguments);
                index++;
                /*var obj = settings.associatedCombos[key];
                for (var prop in obj) {
                    if(prop==='url'){
                        //alert('hay url');
                    }
                }*/
            }

       }
       
        function ca_ManageResponses_single(nestedFunctions, response, element){
           nestedFunctions.caFunctionSingle(element, response[0]); 
        }


        function ca_AjaxCall(customAjaxOptions){
           var defaultOptions = { type: "POST", data: {}, dataType: "json"};
           customAjaxOptions = $.extend(true,defaultOptions, customAjaxOptions);
           if(!customAjaxOptions.url){console.log('*****************');console.log('ERROR: FALTA URL PARA LLAMADA AJAX EN LAS OPCIONES');console.log('*****************');return false;}
           /* WARNING:......LARAVEL???*/ 
           //if(!customAjaxOptions.data._token){ customAjaxOptions.data._token = "{{csrf_token()}}";}
           return $.ajax(customAjaxOptions);	
        }
        
       
}( jQuery ));