'use strict';

$(document).ready(function () {

    getCompany();

    getHigherProcess();
    
    //조회 버튼 클릭 시
    $('#searchBtn').on('click', function () {
        getComHigherSt();
    });

    //회사 선택 시
    $('#company_cd').on('change', function () {
        getComHigherSt();
        
    });

    //상위업무 선택 시
    $('#higher_cd').on('change', function () {
        getComHigherSt();
    });

    //연도 선택 시
    $('#yyyy').on('click', function () {
        getComHigherSt();
    });
    
});


/**
 * rowSpan 합치기
 */
function rowSpan(){
    $(".target-table").rowspanizer({
        //합치고자 하는 row 지정
        //cols : [0, 1, 4], 
        cols : [0],
        vertical_align: "middle"
    });
}

/**
 * 회사별 상위업무 통계 가져오기
 */
function getComHigherSt(){


    var reqParam = 'company_cd=' + encodeURIComponent($('#company_cd').val()) +'&higher_cd=' + $('#higher_cd').val() + '&yyyy=' + $('#yyyy').val() ;
    $.ajax({          
        type: "GET",
        async: true,
        //url: "/statistic/getComHigher/",
        url: "/statistic/getProcessGubun/",
        contentType: "application/json",
        data : reqParam,
        dataType: "json", 
        error: function (request, status, error) {
            alert("getProcessGubun : " + error+ " "+request.responseText);
        },         
        success: function( data ) {
            setProcessGubun(data);
            
        }             
    }); 
}

/**
 * 회사별 상위업무 통계 display
 */
function setProcessGubun(dataObj){
    $("#more_list").empty();

    var totalCntSum = 0;
    var stCnt2Sum = 0;
    var stCnt3_4Sum = 0;
    var stCnt5Sum = 0;
    var solRatioAvg = 0;
    var valAvg = 0;
    var valSum = 0;
    var sumCnt = 0;

    if (dataObj.length > 0) {
        for (var i = 0; i < dataObj.length; i++) {
    
            var addList = "";
            addList += "<tr>";
            addList += "    <td class='text-left'>" + dataObj[i]._id.process_nm + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].totalCnt + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].stCnt3_4 + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].solRatio + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].valAvg + "</td>";
            addList += "</tr>";
            
            totalCntSum = Number(totalCntSum + dataObj[i].totalCnt);
            stCnt3_4Sum = Number(stCnt3_4Sum + dataObj[i].stCnt3_4);
            solRatioAvg = (stCnt3_4Sum / totalCntSum * 100).toFixed(2);


            /*
            var process_gubun1 = "";
            var process_gubun2 = "";

            process_nm1 = dataObj[i]._id.process_nm;
            if( i < dataObj.length - 1){
                process_gubun2 = dataObj[i+1]._id.process_nm;
            }
            */

            if(dataObj[i].valAvg > 0){
                valSum = Number(valSum) + Number(dataObj[i].valAvg); 
                sumCnt = sumCnt + 1;
                valAvg = Number(valSum / sumCnt).toFixed(2);
            } 



            //if(process_gubun2 == null ){
            if(i == Number(dataObj.length-1)){
                addList += "<tr bgcolor='#D4F4FA'>";
                addList += "    <td id='sumTR' class='text-center'>소 계</td>";
                addList += "    <td class='text-center' id='totalCntSum'>" + totalCntSum + "</td>";
                addList += "    <td class='text-center' id='stCnt3_4Sum'>" + stCnt3_4Sum + "</td>";
                addList += "    <td class='text-center'>" + solRatioAvg + "</td>";
                addList += "    <td class='text-center' id='average'>" + valAvg + "</td>";
                addList += "</tr>";

                totalCntSum = 0;
                stCnt3_4Sum = 0;
                solRatioAvg = 0;
                valAvg = 0;

                valSum = 0; 
                sumCnt = 0;
                
            }

            $("#more_list").append(addList);
            
        }
        
    } else {
        var addList = "";
        addList += "<tr>";
        addList += "    <td colspan='8' class='text-center'>조회된 데이타가 없습니다.</td>";
        addList += "</tr>";

        $("#more_list").append(addList);
    }
   

    rowSpan();
}



/**
 * 상위 업무 조회
 */
function getHigherProcess() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/higherProcess/getHigherProcess/",
        contentType: "application/json",
        //data : reqParam,
        dataType: "json",
        error: function (request, status, error) {
            alert("getHigherProcess : " + error + " " + request.responseText);
        },
        success: function (data) {
            setHigherProcess(data);
        }
    });
}

/**
 * 상위 업무 세팅
 */

function setHigherProcess(data) {
    
    $('#higher_cd').empty();
    $('#higher_cd').append("<option value='*' selected>전체</option>");
    for (var i = 0; i < data.length; i++) {
        $('#higher_cd').append("<option value='" + data[i]["higher_cd"] + "'>" + data[i]["higher_nm"] + "</option>");
    }

    //상위업무 세팅이 끝나면 조회한다.
    getComHigherSt();

}



/**
 * 회사 정보 조회
 */
function getCompany() {
    //var reqParam = 'company_cd=' + company_cd ;
    $.ajax({
        type: "GET",
        async: true,
        url: "/company/getCompany/",
        contentType: "application/json",
        //data : reqParam,
        dataType: "json",
        error: function (request, status, error) {
            alert("getCompany : " + error + " " + request.responseText);
        },
        success: function (data) {
            setCompany(data);
        }
    });
}

/**
 * 회사 정보 세팅
 */
function setCompany(data) {
    $('#company_cd').empty();
    $('#company_cd').append("<option value='*' selected>전체</option>");
    for (var i = 0; i < data.length; i++) {
        $('#company_cd').append("<option value='" + data[i]["company_cd"] + "'>" + data[i]["company_nm"] + "</option>");
    }

    
    //회사 세팅이 끝나면 조회한다.
    getComHigherSt();
}