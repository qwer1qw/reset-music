{
    let view = {
        el: '#tabs',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click', 'li', (e)=>{
                let $li = $(e.currentTarget)
                $li.addClass('active').siblings('.active').removeClass('active')
                let tabName = $li.attr('data-tab-name')
                window.eventHub.emit('select', tabName)
            })
        }
    }
    controller.init(view, model)
}