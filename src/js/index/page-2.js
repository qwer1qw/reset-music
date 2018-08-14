{
    let view = {
        el: '.page-2',
        template: `
        <div class="song-container">
            <div class="left">
                __number__
            </div>
            <div class="right">
                <a href="./song.html?id=__song.id__">
                    <p class="song-name">__song.name__</p>
                    <span class="song-singer">
                        <svg class="icon-sq" aria-hidden="true">
                            <use xlink:href="#icon-sq1"></use>
                        </svg>
                        __song.singer__
                    </span>
                    <svg class="icon-bofang" aria-hidden="true">
                        <use xlink:href="#icon-bofang1"></use>
                    </svg>
                </a>
            </div>
        </div>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            /*动态展示更新时间 */
            let time = new Date()
            time = time.toLocaleDateString().split('/')
            if (time[1] < 10) {
                time[1] = '0' + time[1]
            }
            if (time[2] < 10) {
                time[2] = '0' + time[2]
            }
            this.$el.find('.logo > .time').text(`更新日期：${time[1]}月${time[2]}日`)

            /*渲染歌曲 */
            let { songs } = data
            songs.map((song,number) => {
                if(number < 10){
                    number = '0'+(number+1)
                }
                let $songTab = $(this.template
                    .replace('__song.name__', song.name)
                    .replace('__song.singer__', song.singer)
                    .replace('__song.id__', song.id)
                    .replace('__number__', number)
                )
                this.$el.find('.song-list').append($songTab)
            })
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        /*查询歌曲数据*/
        find() {
            var query = new AV.Query('Song');
            query.descending('createdAt')
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
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('select', (tabName) => {
                if (tabName === 'page-2') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}