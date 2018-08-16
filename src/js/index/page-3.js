{
    let view = {
        el: '.page-3',
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
        render(data = {}) {
            this.$el.find('.songs>.song-list').empty()
            this.$el.find('.songs>.no-song').empty()
            let { songs } = data
            if (typeof songs !== 'string') {
                songs.map((song) => {
                    let $songTab = $(this.template
                        .replace('{{song.name}}', song.attributes.name)
                        .replace('{{song.singer}}', song.attributes.singer)
                        .replace('{{song.id}}', song.id)
                    )
                    this.$el.find('.songs>.song-list').append($songTab).parent().addClass('active').siblings('.hot').addClass('hide')
                })
            } else {
                this.$el.find('.songs>.song-list').empty()
                this.$el.find('.songs>.no-song').text(songs).parent().addClass('active').siblings('.hot').addClass('hide')
            }
            setTimeout(() => {
                let $input = this.$el.find('.box>input')
                let value = $input.val()
                this.showDelete(value)
            }, 300)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        },
        showDelete(value) {
            if (value !== '') {
                this.$el.find('.icon-delete').removeClass('hide')
            } else {
                this.$el.find('.icon-delete').addClass('hide')
                this.$el.find('.songs').removeClass('active').siblings('.hot').removeClass('hide')
            }
        },
        
    }
    let model = {
        data: {
            song: null
        },
        find(value) {
            console.log(value)
            var song1 = new AV.Query('Song');
            var song2 = new AV.Query('Song');
            song1.contains('name', value)
            song2.contains('singer', value)
            var song = AV.Query.or(song1, song2);
            return song.find().then((song) => {
                if (song.length !== 0) {
                    this.data.songs = song
                } else {
                    this.data.songs = '暂无搜索结果'
                }
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.bindEvents()
        },
        bindEvents() {
            let time = undefined
            this.view.$el.find('.box>input').on('input', (e) => {
                setTimeout(()=>{
                    let $input = $(e.currentTarget)
                    let value = $input.val().trim()
                    this.view.showDelete(value)
                    if (value === '') { return }
                    if (time) {
                        clearTimeout(time)
                        time = setTimeout(() => {
                            this.model.find(value).then(() => {
                                this.view.render(this.model.data)
                            })
                        }, 300)
                    } else {
                        time = setTimeout(() => {
                            this.model.find(value).then(() => {
                                this.view.render(this.model.data)
                            })
                        }, 300)
                    }
                },0)
            })
            this.view.$el.find('.icon-delete').on('click', () => {
                this.view.$el.find('.box>input').val('')
                this.view.showDelete('')
            })
            this.view.$el.find('.hot > ol > li').on('click', (e)=>{
                let $input = this.view.$el.find('.box>input')
                $input.val($(e.currentTarget).text())
                let value = $input.val()
                console.log(value)
                this.model.find(value).then(() => {
                    this.view.render(this.model.data)
                })
                this.view.showDelete(value)
            })
        },
        bindEventHub() {
            window.eventHub.on('select', (tabName) => {
                if (tabName === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}