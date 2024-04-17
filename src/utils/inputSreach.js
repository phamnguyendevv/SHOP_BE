let inputSreach = {
    inPut: async (data) => {

        const {pagingParams, filterParams} = data;
        const { orderBy, keyword, pageIndex, pageSize } = pagingParams;
        const { user_id } = filterParams;
        const page = parseInt(pageIndex) - 1 || 0;
        const limit = parseInt(pageSize) || 5;
        

    }





}


export default inputSreach;