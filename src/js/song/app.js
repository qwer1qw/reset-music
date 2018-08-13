{
    let view = {
        el: '.page',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {song} = data
            let {lyric} = song
            lyric.split('\n').map((string)=>{
                let p = document.createElement('p')
                string = string.split('[')
                string = string.join('')
                string = string.split(']')
                let time = string[0]
                time = time.split(':')
                newTime = parseInt(time[0]*60) + parseFloat(time[1])
                let word = string[1]
                p.setAttribute('data-time', newTime)
                p.textContent = word
                this.$el.find('.lines').append(p)
            })
            this.$el.siblings('.bg').css('background-image', `url(${song.cover})`)
            this.$el.find('.lyric-container .song-name').text(song.name)
            this.$el.find('.lyric-container .song-singer').text(song.singer)
            this.$el.find('.disk .song-img').attr('src', song.cover)
            let audio = this.$el.find('audio').attr('src', song.url).get(0)
            audio.onended = ()=>{
                this.pause()
            }
            audio.ontimeupdate = ()=>{
                this.showLyric(audio.currentTime)
            }
        },
        play(){
            this.$el.find('audio')[0].play()
            this.$el.find('.icon-play').removeClass('active').siblings('.icon-pause').addClass('active')
            this.$el.find('.disk').addClass('playing')
        },
        pause(){
            this.$el.find('audio')[0].pause()
            this.$el.find('.icon-pause').removeClass('active').siblings('.icon-play').addClass('active')
            this.$el.find('.disk').removeClass('playing')

        },
        /*歌词滚动与高亮*/
        showLyric(time){
            let allPTab = this.$el.find('.lyric-container > .lyrics > .lines > p')
            let p
            for(let i = 0; i<allPTab.length;i++){
                if(i === allPTab.length - 1){
                    p = allPTab[i]
                    break
                }else{
                    let currentTime = allPTab[i].getAttribute('data-time')
                    let nextTime = allPTab[i+1].getAttribute('data-time')
                    if(currentTime <= time && time < nextTime){
                        p = allPTab[i]
                        break
                    }
                }
            }
            /* 当前时间点p相对视口的高度 */
            let pHeight = p.getBoundingClientRect().top
            /* 歌词部分相对于视口的高度 */
            let linesHeight = this.$el.find('.lyric-container >.lyrics>.lines')[0].getBoundingClientRect().top    
            let height = pHeight - linesHeight;
            this.$el.find('.lines').css({
                transform: `translateY(${-(height-31)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
            
        }
    }
    let model = {
        data: {
            song: {
                name: '',
                singer: '',
                url: '',
                id: ''
            }
        },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then( (song)=> {
                Object.assign(this.data.song, {id: song.id, ...song.attributes})
                return song
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            /* 过滤 */
            let array = search.split('&').filter(v=>{return v})
            let id
            for(let i = 0; i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                    break
                }
            }
            return id

        },
        bindEvents(){
            this.view.$el.on('click', '.icon-play', ()=>{
                this.view.play()
            }),
            this.view.$el.on('click', '.icon-pause', ()=>{
                this.view.pause()
            })
        }
    }
    controller.init(view ,model)
}