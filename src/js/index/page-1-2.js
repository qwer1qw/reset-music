{
    let view = {
        el: '.page-1 > .play-list',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {

    }
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){

        },
    }
    controller.init(view, model)
}