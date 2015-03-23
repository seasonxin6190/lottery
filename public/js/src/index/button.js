define(function(require, exports, module){
    exports.buttonEffect = function(){
        var $luckDrawBtn = $(".luck-draw-btn"),
            $prizeList = $(".prize-list li"),
            $imgSrc = $(".luck-draw-btn");
            
        $luckDrawBtn.mousedown(function(){
            $imgSrc.css({
                background: 'url("/images/btn_01.png")'
            });
            var luckid = $('#luckID').attr("data-id");

            console.log(typeof(luckid) == 'undefined');

           if(typeof(luckid) == 'undefined'){
                alert('您还未按几等奖喔~');
            }else{
                $.get('/api/lottery/index/lottery',{lottery: luckid},function(data,status){
                    console.log('sta:'+data.status);
                  if(data.status){
                    var lotteryData = data.rows;
                    var lotteryText =[];
                    var lotteryLen = lotteryData.length;
                  //  console.log(lotteryLen);
                  //  console.log(lotteryData);
                    for(var i=0;i<lotteryLen;i++){
                        lotteryText[i]= '<li><img class="img-responsive" data-id='+i+'_'+lotteryData[i]['id']+'_'+luckid+'  src='+lotteryData[i]['photo']+' width="128" height="125"><label>'+lotteryData[i]['name']+'</label></li>'
                       
                    }
                  //  console.log(lotteryText.toString());
                    $("#winnerList").html(lotteryText.join('')); 
                  }else if(data.status == 0){
                     /*$(this).css({
                        background: 'url("/images/button_04.png")'
                    });*/
            
                     /*$('#luckID').removeAttr('data-id');*/
                     //alert('--------');
                     $('.prize-list .selected').addClass('disabled');
                    alert('该奖项已经抽完！')
                  }
                })
            }
          //  console.log('test');
        });
        $luckDrawBtn.mouseup(function(){
            $imgSrc.css({
                background: 'url("/images/btn_02.png")'
            });
        });
        $prizeList.mousedown(function(){
            // $(this).css({
            //     background: 'url("/images/button_04.png")'
            // });
            var luckId = $(this).attr("data-id");
            $('.prize-list li').removeClass('selected');
            $('#luckID').removeAttr('style');
            $(this).addClass('selected');
            $('#luckID').removeAttr('data-id');
            $('#luckID').attr('data-id',luckId);
         //   console.log(luckId);

            $.get('/api/award',{award: luckId}, function(data, status){
          //      console.log(data);
                $('.prize').text(' ')
                $('.prize').text(data[0]['des']);
            })
            
        });
        $('#winnerList').delegate('.img-responsive','click',function(){
        //    alert($(this).attr('data-id'));
        //    alert('000');
            var changeId = $(this).attr('data-id');
            var chageArr = [];
                chageArr = changeId.split('_');  // 2_13_32_1      2 是页面位置，13被替换的人，32是奖项，1是活动
            var thisVar = $(this);
          //  $(this).attr({src:'/images/head_05.jpg'});

        if(typeof(changeId) == 'undefined'){
                alert('请联系系统管理员');
            }else{
                $.get('/api/lottery/index/lotteryAgain',{lottery: changeId},function(data,status){
                    if(data.status){    
                        var lotteryData = data.rows;
                        var lotteryText =[];
                        var lotteryLen = lotteryData.length;
                    //    console.log(lotteryData);
                    //    console.log(changeId);
                        thisVar.attr({'data-id':''});
                        thisVar.attr({src:lotteryData[0]['photo'],'data-id':chageArr[0]+'_'+lotteryData[0]['id']+'_'+chageArr[2]+'_'+chageArr[3]});
                        thisVar.next().text(lotteryData[0]['name']);
                    //    alert('opp:'+thisVar.next().text());
                    }else{
                        alert('请求失败！');
                    }
                })        
            } 



            
        })
/*    exports.seat = function(){
        var $winners_list = $(".name-list"),
            $winners_state = $(".prize-list");
        place();
        function place(){
            $winners_list.css({
                left: "50%",
                marginLeft: -$winners_list.width() / 2 + "px"
            });
            $winners_state.css({
                left: "50%",
                marginLeft: -$winners_state.width() / 2 + "px"
            });
        }
        $(window).resize(function(){
            place();
        })
    }*/
/*        $prizeList.mouseup(function(){
            $(this).css({
                background: 'url("/images/button_03.png")'
            });
        });*/

    }
})