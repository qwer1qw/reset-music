{
    let view = {
        el: '.page-2',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.bindEvents()
        },
        bindEvents(){

        },
        bindEventHub(){
            window.eventHub.on('select', (tabName)=>{
                if(tabName === 'page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view ,model)
}