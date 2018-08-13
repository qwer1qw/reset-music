{
    let view = {
        el: '.page-1 > .song-list',
        template: `
        <a href="./song.html?id={{song.id}}" >
            <p class="song-name">{{song.name}}</p>
            <span class="song-singer">
                <svg class="icon-sq" aria-hidden="true">
                    <use xlink:href="#icon-sq1"></use>
                </svg>
                {{song.singer}}
            </span>
            <svg class="icon-bofang" aria-hidden="true">
                <use xlink:href="#icon-bofang1"></use>
            </svg>
        </a>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { songs } = data
            console.log(songs)
            songs.map((song) => {
                let $songTab = $(this.template
                    .replace('{{song.name}}', song.name)
                    .replace('{{song.singer}}', song.singer)
                    .replace('{{song.id}}', song.id)
                )
                this.$el.find('.song-list-container').append($songTab)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}