/**
 * comboAssociate Plugin
 *
 */
(function ($) {
        $.fn.comboAssociate = function(options) {
           
            if(typeof options === 'undefined'){alert('Error: comboAssociate initializing error: no settings');return false;}
     
            /* Default settings to use in this plugin - don't change */
            var settings = $.extend({
                debug: false, 
                data: {},
                url: null,
                chooseOption: false,
                chooseOptionValue: '0',
                chooseOptionText: 'Choose an option...',
                empty: true,
                dataType: "json", 
                type: "POST",
                onChange: function() { 
                    console.log('comboAssociate - default onChange function');
                    return true;
                },
                beforeFunction: function() { 
                    console.log('comboAssociate - default beforeFunction');
                    return true;
                },
                afterFunction: function() {
                    console.log('comboAssociate - default afterFunction');
                    return true;
                }					
            }, options);
            

            var comboAssociateDebug = true;
            if( settings.debug === false ){comboAssociateDebug = false;}     
            if(comboAssociateDebug){
                console.log('Creating comboAssociate...');
                console.log('comboAssociate - settings:');
                console.log(settings);
            }
            
                
            var loopOverElements = [];
            this.each(function(index, element){
                loopOverElements.push(element); 
                
                if(comboAssociateDebug){console.log('comboAssociate - plugin will try to attach element:' + index + ' - '+ element);}
            });

            if( (typeof loopOverElements === 'undefined') || (loopOverElements.length==0) ){
                console.log('Error: comboAssociate initializing error: no targeting elements found'); 
                return false;
            }

            if(comboAssociateDebug){console.log('comboAssociate - plugin will try to attach :' + loopOverElements.length + ' elements' );}
    
                
            for(index=0;index<loopOverElements.length;index++){
                var selectorId = loopOverElements[index];

                var userActionsSingle = executeFunctionSingle(selectorId, settings.beforeFunction, 'userBefore'),
                chainedSingle = userActionsSingle.then(function(data) {
                  //console.log('userActionsSingle:' + data);
                  return executeFunctionSingle(data, comboAssociateSingleFunction, 'executeFunction');
                });
                chainedSingle.done(function(data) {
                    //console.log('pal after done:' + data);
                    executeFunctionSingle(data, settings.afterFunction, 'userAfter');
                });
            }
               
               
               
                
            /* Creating comboAssociate - BEGIN NESTED FUNCTIONS BLOCK */
            function comboAssociateSingleFunction(elem){
                
                if(comboAssociateDebug){console.log('comboAssociate - comboAssociateSingleFunction:' + elem);}

                var requests = [];
                var nestedSingleFunctions = {};
                
                var urlOptionElement = settings.url;
                var chooseOptionOptionElement = settings.chooseOption;
                var chooseOptionValueOptionElement = settings.chooseOptionValue;
                var chooseOptionTextOptionElement = settings.chooseOptionText;
                var dataTypeOptionElement = settings.dataType;
                var typeOptionElement = settings.type;

                var dataOptionElement;;
                if(typeof settings.data === 'undefined'){
                    dataOptionElement = 'undefined';
                }else{
                    dataOptionElement = settings.data;
                }

                var dataAjax = {};
                if( (dataOptionElement !== 'undefined') ){
                    for (var entry in dataOptionElement) {
                        dataAjax[entry] = dataOptionElement[entry];
                    }
                }

                if(comboAssociateDebug){
                    console.log('comboAssociate - taking ajax data...');
                    console.log('comboAssociate - data:');
                    console.log(dataAjax);
                }


                if( urlOptionElement != null){
                    var ajaxOptions = {
                        type: typeOptionElement,
                        url: urlOptionElement,
                        dataType: dataTypeOptionElement,   
                        data : dataAjax 
                    };

                    var processAjax = ca_AjaxCall(ajaxOptions); 
                    requests.push(processAjax); 
                }
                

                nestedSingleFunctions.caFunctionSingle = function(loopElement, response) {

                    if(comboAssociateDebug){
                        console.log('comboAssociate - taking functions on ' + loopElement);
                        console.log('comboAssociate - response:');
                        console.log( response);
                    }       
                    var oldHTMLContent;
                    if(settings.empty !== true){
                       oldHTMLContent = $(loopElement).html(); 
                    }  
                    var strOptions = '';   
                    if(chooseOptionOptionElement){
                        strOptions += '<option value="' + chooseOptionValueOptionElement + '" selected>' + chooseOptionTextOptionElement + '</option>';
                    }
                    $.each(response, function(responseKey, responseValue) {      
                        strOptions += '<option value="'+responseKey+'" >'+responseValue+'</option>';
                    });
                    $(loopElement).html(oldHTMLContent + strOptions);
                };

                $.when.apply(
                        $, requests
                ).done(function(){
                    if(comboAssociateDebug){
                        console.log('comboAssociate - Done()');
                        console.log('comboAssociate - Done() arguments:');
                        console.log(arguments);
                    }
                    ca_ManageResponses_single(nestedSingleFunctions, arguments, elem);

                }).fail(function(){
                    if(comboAssociateDebug){
                        console.log('comboAssociate - Fail()');
                        console.log('comboAssociate - Fail() arguments:');
                        console.log(arguments);
                    }
                });

                $(elem).on('change', function() {
                    if(comboAssociateDebug){
                        console.log('comboAssociate - ' + selectorId + ' Change()');
                        console.log(arguments);
                    }
                    var returnedDfd = executeFunctionSingle(null, settings.onChange, ' Change()');
                    return returnedDfd;
                });
            }

   
            function executeFunctionSingle(elem, varFunction, consoleText) {  
                if(comboAssociateDebug){
                    console.log('comboAssociate - executeFunction:' + consoleText);
                    console.log('comboAssociate - elem:' + elem);
                }
                var dfd = $.Deferred();
                try{
                    if(typeof varFunction === "function"){
                        varFunction(elem);
                        dfd.resolve(elem); 
                    }
                }catch(error){
                    dfd.reject(error);
                }
                return dfd.promise();
            }
            /* Creating comboAssociate - END NESTED FUNCTIONS BLOCK */

            /* FINALLY - We return the object - It's useful when you need to chaining other jQuery functions before initializing the comboAssociate jQuery Plugin - See the docs for more info*/
            return this; 
        };
       

        /* comboAssociate - single mode - BEGIN AUX FUNCTIONS BLOCK */
        function ca_ManageResponses_single(nestedFunctions, response, element){
           nestedFunctions.caFunctionSingle(element, response[0]); 
        }
        function ca_AjaxCall(customAjaxOptions){
           var defaultOptions = { type: "POST", data: {}, dataType: "json"};
           customAjaxOptions = $.extend(true,defaultOptions, customAjaxOptions);
           if(!customAjaxOptions.url){return false;}
           return $.ajax(customAjaxOptions);	
        }
         /* comboAssociate - single mode - END AUX FUNCTIONS BLOCK */
}( jQuery ));