function api_call(input){
    $.ajax({
        url: "/api",
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(input),
        success: function(data, textStatus, jQxhr){
            $('#prediction_output').html(data);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            $('#prediction_output').html( "There was an error." );
            console.log( errorThrown );
        },
        timeout: 3000
    });
}