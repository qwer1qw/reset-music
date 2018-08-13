{
    let view = {
        el: 'section.song-list',
        template: `
                <ol>
                    
                </ol>
                `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            this.$el.html(this.template)
            let { songs } = data
            songs.map((song) => {
                let $li = $('<li></li>').text(`${song.name}-${song.singer}`).attr('data-id', song.id)
                this.$el.find('ol').append($li)
            })
        },
        active(li){
            li.addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectId: undefined,
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
                console.log(this.model.data)
            })
            
            this.bindEvents()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('create', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update', (data)=>{
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === data.id) {
                    Object.assign(songs[i], data)

                    }
                }
                this.view.render(this.model.data)
            })
        },
        bindEvents() { 
            this.view.$el.on('click', 'li', (e)=>{
                /*点击歌曲激活li，获取歌曲id，通过select将歌曲信息传给form*/
                let $li = $(e.currentTarget)
                this.view.active($li)
                let songId = $li.attr('data-id')
                this.model.data.selectId = songId
                let songs = this.model.data.songs
                let data
                songs.map((song)=>{
                    if(songId === song.id){
                        data = song
                    }
                })
                
                window.eventHub.emit('select', data)
            })
        }
    }
    controller.init(view, model)
}