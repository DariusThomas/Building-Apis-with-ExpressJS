$(document).ready(function () {
    let $chirps = $('#chirp-container');
    let $btn = $('#submit-btn');
    let $text = $('#text-input');
    
    $btn.click(postChirp)

    class Chirp {
        constructor(chirp, id) {
            this.chirp = chirp;
            this.id = id
            this.chirpDiv = $(`<div ${this.id} class=" border d-flex justify-content-between p-3"><p>${this.chirp.name}: <strong>${this.chirp.text}</strong></p></div>`)
            this.btnDiv = $('<div></div>')
            this.editBtn = $('<button class="btn btn-info">Edit</button>')
            this.deleteBtn = $('<button class="btn btn-danger">Delete</button>')
            this.btnDiv.append(this.editBtn);
            this.btnDiv.append(this.deleteBtn);
            this.chirpDiv.append(this.btnDiv);
            this.editBtn.click(this.openEditChirpModal.bind(this))
            this.deleteBtn.click(this.deleteChirp.bind(this))
            $chirps.prepend(this.chirpDiv)
        }
        deleteChirp() {
            $chirps.empty();
            $.ajax({
                type: 'DELETE',
                url: `/api/chirps/${this.id}`,
                success: function () {
                    $.get('/api/chirps', function (chirps) {
                        $.each(chirps, function (id, chirp) {
                            if (id != 'nextid') {
                                let allChirps = new Chirp(chirp, id)
                            }
                        })
                    });

                }
            })
        }

        openEditChirpModal() {
            let $modalContainer = $('<div></div>')
            let $modal = $('<div><h1>Edit Chirp<h1></div>')
            let $modalText = $('<input class="w-75 h-25 m-3"  type="text">')
            let $modalBtn = $('<input class ="btn btn-info" value="Submit Edit" type="button">')
            $modalBtn.click(editChirp.bind(this))
            $modalContainer.css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'height': '100vh',
                'width': '100vw',
                'background-color': 'rgba(0,0,0,.8)',
            });
            $modal.css({
                'height': '15em',
                'width': '22em',
                'border-radius': '5px',
                'background-color': 'white',
                'display': 'flex',
                'flex-direction': 'column',
                'align-items': 'center',
                'justify-content': 'center'
            })
            $modalText.appendTo($modal)
            $modalBtn.appendTo($modal)
            $modalContainer.append($modal)
            $('body').append($modalContainer);

            function editChirp() {
                let chirpEdit = {
                    name: "me",
                    text: $modalText.val()
                }
                $chirps.empty();
                $.ajax({
                    type: "PUT",
                    url: `/api/chirps/${this.id}`,
                    data: JSON.stringify(chirpEdit),
                    contentType: 'application/json',
                    success: function () {
                        $modalContainer.remove();
                        $.get('/api/chirps', function (chirps) {
                            $.each(chirps, function (id, chirp) {
                                if (id != 'nextid') {
                                    let allChirps = new Chirp(chirp, id)
                                }
                            })
                        });
                    }
                })

            }
        }

    }

    $.get('/api/chirps', function (chirps) {
        $.each(chirps, function (id, chirp) {
            if (id != 'nextid') {
                let allChirps = new Chirp(chirp, id)
            }
        })
    });

    function postChirp() {
        let chirp = {
            name: "me",
            text: $text.val()
        }
        $.ajax({
            type: "POST",
            url: "/api/chirps/",
            data: JSON.stringify(chirp),
            contentType: 'application/json',
            success: function (res) {
                $.get('/api/chirps/', function (chirps) {
                    let arr = Object.keys(chirps)
                    let id = arr[arr.length - 2]
                    let newChirps = new Chirp(chirp, id)
                })

            }
        })
        $text.val('');
    }
})