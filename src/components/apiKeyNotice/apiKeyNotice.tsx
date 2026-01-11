import { useNavigate } from 'react-router-dom';
import styles from './apiKeyNotice.module.scss';

type ApiKeyNoticeProps = {
    variant?: 'inline' | 'standalone';
};

function ApiKeyNotice({ variant = 'inline' }: ApiKeyNoticeProps) {
    const navigate = useNavigate();

    return (
        <section
            className={`${styles.notice} ${
                variant === 'standalone' ? styles.standalone : ''
            }`}
        >
            <div>
                <h3>Finnhub API 키가 필요합니다</h3>
                <p>
                    데이터를 불러오려면 Finnhub API 키를 설정해야 합니다. 설정
                    페이지에서 키를 등록해 주세요.
                </p>
            </div>
            <button type="button" onClick={() => navigate('/settings')}>
                설정으로 이동
            </button>
        </section>
    );
}

export default ApiKeyNotice;
