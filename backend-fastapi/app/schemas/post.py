from sqlalchemy import text
from utils.database import engine




# 삽입/조회/수정/삭제

#routes -> 주소 -> 함수(controllers) ->
#넘겨받은 요청 파라미터 -> service 쪽으로 전달
# service 쪽에서 전달받은 파라미터를 model쪽으로 전달
# 전달 받은 파라미터 (post_id)
# 처리 후 동작
# model 쪽에서 값을 반환 -> service쪽에서 전달 받아서
# 비즈니스 로직 수행(오류 발생 혹은 결과를 전송)
# controllers 쪽으로 값을 전달 -> 요청했던 클라이언트 쪽으로
# 결과를 반환