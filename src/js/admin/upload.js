{
    let view = {
        el: 'section.song-upload',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.QiniuInit()
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('update', () => {
                this.view.show()
            })
            window.eventHub.on('create', () => {
                this.view.show()
            })
            window.eventHub.on('select', () => {
                this.view.hide()
            })

        },
        QiniuInit() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: 'upload',       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                domain: 'pd4ts0xuj.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                //pd4ts0xuj.bkt.clouddn.com
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                //container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'upload-container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file) => {
                        // 每个文件上传前,处理相关的事情
                        window.eventHub.emit('new')
                        this.view.hide()

                    },
                    'UploadProgress': function (up, file) {
                        window.eventHub.emit('uploading', file.percent)
                    },
                    'FileUploaded': (up, file, info) => {
                        var domain = (up.getOption('domain'))
                        var response = JSON.parse(info.response)
                        var link = `http://${domain}/${encodeURIComponent(response.key)}`
                        var data = {
                            name: response.key,
                            url: link
                        }
                        window.eventHub.emit('upload', data)
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    },

                }
            });
        },
    }
    controller.init(view, model)
}