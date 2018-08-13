{
    let view = {
        el: 'section.song-form',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let options = ['name', 'singer', 'url', 'cover', 'lyric']
            options.map((string) => {
                // this.$el.find(`input[name=${data}]`)
                this.$el.find(`[name=${string}]`).val(data[string])
            })
            this.show()
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
            name: '',
            singer: '',
            url: '',
            id: '',
        },
        reset() {
            this.data = {
                name: '',
                singer: '',
                url: '',
                id: '',
            }
        },
        create(data) {
            // 声明一个 Todo 类型
            var Song = AV.Object.extend('Song');
            // 新建一个 Todo 对象
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, function (error) {
                // 异常处理
                console.error('Failed to create new object, with error message: ' + error.message);
            });
        },
        update(data) {
            console.log(data)
            // 第一个参数是 className，第二个参数是 objectId
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)
            console.log(typeof song.attributes.lyric)
            console.log(typeof song.attributes.name)
            // 保存到云端
            return song.save().then(()=>{

            },
            (x)=>{
                console.log(x)
            }
        )
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.bindEventHub()
        },
        createData() {
            let options = ['name', 'singer', 'url', 'cover', 'lyric']
            let data = {}
            options.map((string) => {
                data[string] = this.view.$el.find(`[name=${string}]`).val()
            })
            this.model.create(data).then(() => {
                window.eventHub.emit('create', this.model.data)
                /*创建完成后置空model */
                this.model.reset()
            })
        },
        updateData() {
            let options = ['name', 'singer', 'url', 'cover', 'lyric']
            let data = {}
            options.map((string) => {
                data[string] = this.view.$el.find(`[name=${string}]`).val()
            })
            Object.assign(this.model.data, data)
            this.model.update(data).then(() => {
                window.eventHub.emit('update', this.model.data)
                /*修改完成后置空form的model数据*/
                this.model.reset()
            })
        },
        bindEvents() {
            /*判断此时model是否有id，有id则修改歌曲，无id表示用户想创建歌曲*/
            this.view.$el.find('button').on('click', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.updateData()
                } else {
                    this.createData()
                }
                this.view.hide()
            })
        },
        bindEventHub() {
            window.eventHub.on('new', () => {
                this.model.reset()
            })
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.show()
                this.view.render(data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(data)
            })
        }
    }
    controller.init(view, model)
}