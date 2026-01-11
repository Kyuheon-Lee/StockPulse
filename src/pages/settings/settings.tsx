import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import styles from './settings.module.scss';

function SettingsPage() {
    const storedKey = useSettingsStore((state) => state.finnhubApiKey);
    const setFinnhubApiKey = useSettingsStore(
        (state) => state.setFinnhubApiKey,
    );
    const clearFinnhubApiKey = useSettingsStore(
        (state) => state.clearFinnhubApiKey,
    );
    const [apiKey, setApiKey] = useState(() => storedKey);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setApiKey(storedKey);
    }, [storedKey]);

    useEffect(() => {
        if (!statusMessage) {
            return undefined;
        }
        const timeoutId = window.setTimeout(() => {
            setStatusMessage('');
        }, 3000);
        return () => window.clearTimeout(timeoutId);
    }, [statusMessage]);

    const handleSave = () => {
        setFinnhubApiKey(apiKey);
        setStatusMessage('API 키가 저장되었습니다.');
    };

    const handleClear = () => {
        clearFinnhubApiKey();
        setApiKey('');
        setStatusMessage('API 키가 삭제되었습니다.');
    };

    return (
        <section className={styles.settings}>
            <div className={styles.header}>
                <h2>설정</h2>
                <p>개인 Finnhub API 키를 설정해 데이터를 불러올 수 있어요.</p>
            </div>

            <div className={styles.card}>
                <h3>Finnhub API 키</h3>
                <p>
                    아직 키가 없다면{' '}
                    <a
                        href="https://finnhub.io/register"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Finnhub에서 발급받기
                    </a>
                </p>
                <label className={styles.field}>
                    <span>API 키</span>
                    <input
                        type="text"
                        value={apiKey}
                        placeholder="여기에 API 키를 붙여 넣으세요"
                        onChange={(event) => {
                            setApiKey(event.target.value);
                            setStatusMessage('');
                        }}
                    />
                </label>
                <div className={styles.actions}>
                    <button type="button" onClick={handleSave}>
                        저장
                    </button>
                    <button
                        type="button"
                        className={styles.ghost}
                        onClick={handleClear}
                    >
                        삭제
                    </button>
                </div>
                {statusMessage && (
                    <div className={styles.savedNotice}>{statusMessage}</div>
                )}
            </div>
        </section>
    );
}

export default SettingsPage;
