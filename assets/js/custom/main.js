var data;
var contenido = [];

$(document).ready(function() {

    readJSON();

    function readJSON() {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            data = xhttp.responseText;
            data = JSON.parse(data);
        };
        xhttp.open("GET", "assets/js/custom/playlist.json", false);
        xhttp.send();

        insertItemsList();
    };

    function insertItemsList() {
        for (var i in data) {
            $('#items').append("<li id='" + i + "' class='" + data[i].type + "'> " + data[i].title + "</li>")
        }
    };

    //creamos un objeto Audio de HTML5 para reproducir archivos
    var mediaPlayer = document.getElementById('player');

    // Variable para almacenar el elemento que se está reproduciendo
    var currentItem = 0;

    // Cantidad total de elementos en la lista
    var totalItems = $('#items li').length;

    // Asignamos al reproductor el primer elemento de la lista
    var itemID = $('#items').children().eq(0).attr('id');
    asignPath(itemID);

    // Asignar el tooltip del porcentaje del volumen
    $('.volume title').text('Volumen al ' + mediaPlayer.volume * 100 + '%');

    // Evento para el botón de play
    $('.play').on('click', function() {
        $.start();
    });

    // Reproducir elemento siguiente de la lista
    $('.next').on('click', function() {
        // Comprobar si hay más elementos siguientes
        if (currentItem < totalItems - 1) {
            currentItem++;
        } else {
            // Volvemos al primer elemento de la lista
            currentItem = 0;
        }
        $.start();
    });

    // Reproducir elemento anterior de la lista
    $('.previous').on('click', function() {
        // Comprobar si estamos en el primer elemento
        if (currentItem >= 1) {
            currentItem--;
        } else {
            // Pasamos al último elemento de la lista
            currentItem = $('#items li').length - 1;
        }
        $.start();
    });

    // Función para asignar la ruta a los archivos de media
    function asignPath(itemID) {
        for (var i in data) {
            if (itemID == i) {
                itemType = data[i].type;
                if (itemType != 'audio') {
                    if (screen.width < 768) {
                        $('#path1').attr({ 'src': data[i].movil, 'type': data[i].extension1 });
                        $('#path2').attr({ 'src': '', 'type': '' });
                        $('#path3').attr({ 'src': '', 'type': '' });
                    } else {
                        $('#path1').attr({ 'src': data[i].path1, 'type': data[i].extension1 });
                        $('#path2').attr({ 'src': data[i].path2, 'type': data[i].extension2 });
                        $('#path3').attr({ 'src': data[i].path3, 'type': data[i].extension3 });
                    }
                } else {
                    $('#path1').attr({ 'src': data[i].path1, 'type': data[i].extension1 });
                    $('#path2').attr({ 'src': '', 'type': '' });
                    $('#path3').attr({ 'src': '', 'type': '' });
                }
            }
        }
        mediaPlayer.load();
    }

    // Función que reproduce los archivos
    $.start = function() {
        $('.error').fadeOut();
        var $itemRunning = $('#items').children().eq(currentItem);

        // Asignamos la ruta del archivo que se va a reproducir y se lo asignamos al source del reproductor
        var itemID = $itemRunning.attr('id');
        asignPath(itemID);

        // Desmarcamos cualquier elemento de la lista
        $('#items li').removeClass('running');

        // Eliminamos el ecualizador
        $('#equalizer').remove();

        // Marcamos el elemento actual de la lista
        $itemRunning.addClass('running');

        // Añadimos el SVG con la animación de ecualizador
        $itemRunning.prepend(
            "<svg id='equalizer' width='16px' height='16px' viewBox='0 0 16 16'>" +
            "<g fill='#323232'>" +
            "<rect class='equalizer_bar animation' id='equalizer_bar1' x='1' y='8' width='4' height='8'></rect>" +
            "<rect class='equalizer_bar animation' id='equalizer_bar2' x='6' y='1' width='4' height='15'></rect>" +
            "<rect class='equalizer_bar animation' id='equalizer_bar3' x='11' y='4' width='4' height='12'></rect>" +
            "</g>" +
            "</svg>"
        );

        // Añadimos la clase de animación al svg del repdroductor
        $('.note').addClass('note-heartbeat');
        if ($itemRunning.hasClass('video')) {
            $('.note').hide();
        } else {
            $('.note').show();
        }

        // Reproducir el elemento con el método play
        mediaPlayer.play();
        $('.play').hide();
        $('.pause').show();

        // Activar el sonido
        $('.volume_on').on('click', function() {
            mediaPlayer.muted = false;
            $(this).hide();
            $('.volume_off').show();
            $.changeVolume(mediaPlayer.volume);
        });

        // Desactivar el sonido
        $('.volume_off').on('click', function() {
            mediaPlayer.muted = true;
            $(this).hide();
            $('.volume_on').show();
            // $('.volume title').text('Volumen silenciado');
            $.changeVolume(0);
        });

        // Activar/Desactivar el sonido
        // $('.volume_off').on('click', function() {
        //     mediaPlayer.muted = !mediaPlayer.muted;
        // });

        // Subir el volumen de la reproducción
        $('.more').on('click', function() {
            if (mediaPlayer.volume != 1) {
                mediaPlayer.volume += 0.1;
                mediaPlayer.volume = Math.round(mediaPlayer.volume * 10) / 10;
                $.changeVolume(mediaPlayer.volume);
            }
        });

        // Bajar el volumen de la reproducción
        $('.less').on('click', function() {
            if (mediaPlayer.volume != 0) {
                mediaPlayer.volume -= 0.1;
                mediaPlayer.volume = Math.round(mediaPlayer.volume * 10) / 10;
                $.changeVolume(mediaPlayer.volume);
            }
        });
    };

    // Función que pinta las barras de volumen dependiendo del nivel de volumen
    $.changeVolume = function(value) {
        $('.volume title').text('Volumen al ' + mediaPlayer.volume * 100 + '%');
        $('.min, .low, .high, .max').css('fill', 'rgb(40, 40, 40)');
        switch (true) {
            case value == 1:
                $('.min, .low, .high, .max').css('fill', 'rgb(190, 190, 190)');
                break;
            case value < 1 && value >= 0.7:
                $('.min, .low, .high').css('fill', 'rgb(190, 190, 190)');
                break;
            case value < 0.7 && value >= 0.4:
                $('.min, .low').css('fill', 'rgb(190, 190, 190)');
                break;
            case value < 0.4 && value >= 0.1:
                $('.min').css('fill', 'rgb(190, 190, 190)');
                break;
            case value < 0.1:
                $('.min, .low, .high, .max').css('fill', 'rgb(40, 40, 40)');
                break;
        }
    }

    // Pausar o continuar la reproducción
    $('.pause, .play2').on('click', function() {
        if (mediaPlayer.paused) {
            if (mediaPlayer.currentTime > 0) {
                mediaPlayer.play();
                $('.pause').show();
                $('.play2').hide();
                $('.equalizer_bar').addClass('animation');
                $('.note').addClass('note-heartbeat');
            }
        } else {
            mediaPlayer.pause();
            $('.play2').show();
            $('.pause').hide();
            $('.equalizer_bar').removeClass('animation');
            $('.note').removeClass('note-heartbeat');
        }
    });

    // Retroceder 10 segundos en la reproducción
    $('.rewind').on('click', function() {
        mediaPlayer.currentTime -= 10;
    });

    // Avanzar 10 segundos en la reproducción
    $('.advance').on('click', function() {
        mediaPlayer.currentTime += 10;
    });

    // Detener la reproducción
    $('.stop').on('click', function() {
        mediaPlayer.currentTime = 0;
        mediaPlayer.pause();
        $('.equalizer_bar').removeClass('animation');
        $('.note').removeClass('note-heartbeat');
        $('.pause, .play2').hide();
        $('.play').show();
    });

    // Repdroducir cualquier elemento de la lista
    $('#items li').on('click', function() {
        // Establecemos el número de elemento (usando el índice del li seleccionado)
        currentItem = $(this).index();
        $('.pause').hide();
        $('.play2').hide();
        $.start();
    });

    // Errores del reproductor
    $(mediaPlayer).on('error', function() {
        $('.error').fadeIn();
        $('.equalizer_bar').removeClass('animation');
        $('.note').removeClass('note-heartbeat');
        $('.duration').find('span').text('00:00');
        // Reproducir el siguiente elemento a los 10 segundos
        setTimeout(function() {
            $('.next').trigger('click');
        }, 10000);
    });

    // Evento que se dispara al finalizar la reproducción actual
    $(mediaPlayer).on('ended', function() {
        $('.next').trigger('click');
    });

    // Actualizar el tiempo transcurrido y la barra de progreso
    $(mediaPlayer).on('timeupdate', function() {
        var currentTime = mediaPlayer.currentTime;
        var durationTime = mediaPlayer.duration;
        var progress = (currentTime * 100) / durationTime;

        var state = $.timer(currentTime);

        $('.progressBar').css('width', progress + '%');
        $('.state').find('span').text(state[0] + ':' + state[1]);

        var duration = $.timer(durationTime);

        if (isNaN(duration[0])) {
            $('.duration').find('span').text('00:00');
        } else {
            $('.duration').find('span').text(duration[0] + ':' + duration[1]);
        }
    });

    // Formatear el tiempo en minutos y segundos
    $.timer = function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time - minutes * 60);

        if (seconds < 10) seconds = '0' + seconds;
        if (minutes < 10) minutes = '0' + minutes;

        // Devolvemos un array con el tiempo bien formateado
        return Array(minutes, seconds);
    };
});