{
    let view = {
        el: '.loading',
        template: `
            <div class="loading-bar">
                <div class="bar"></div>
            </div>
            <span>歌曲已上传__number__%,请勿点击页面</span>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let html = this.template
            html = html.replace('__number__', data)
            this.$el.html(html)
            this.$el.find('.bar').css('width', `${data}%`)
        }, 
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.view.render()
            this.model = model
            window.eventHub.on('new', ()=>{
                this.view.show()
            })
            window.eventHub.on('upload', ()=>{
                this.view.render()
                this.view.hide()
            })
            window.eventHub.on('uploading', (data)=>{
                this.view.render(data)
            })
        }
    }
    controller.init(view, model)
}