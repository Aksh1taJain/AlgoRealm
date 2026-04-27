import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen } from 'lucide-react'
import { QUESTS, PRACTICE_TOPICS } from '../data/mockData'
import QuestCard from '../components/QuestCard'
import MissionModal from '../components/MissionModal'
import styles from './Practice.module.css'

const DIFFICULTIES = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXTREME']
const TYPES = ['ALL', 'ALGORITHM', 'DATA_STRUCTURE', 'GRAPH', 'RECURSION', 'ADVANCED']

export default function Practice({ showReward }) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [selectedQuest, setSelectedQuest] = useState(null)

  const filtered = QUESTS.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchDiff = difficulty === 'ALL' || q.difficulty === difficulty
    const matchType = type === 'ALL' || q.type === type
    return matchSearch && matchDiff && matchType
  })

  const handleStart = (quest) => {
    setSelectedQuest(null)
    showReward?.({
      title: 'PRACTICE SESSION',
      subtitle: quest.title,
      xp: Math.floor(quest.xpReward * 0.5),
      coins: Math.floor(quest.coinReward * 0.5),
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>PRACTICE MODE</h1>
          <p className={styles.subtitle}>Sharpen your algorithms. No time limit in practice mode.</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatVal}>{QUESTS.filter(q => q.completed).length}</span>
            <span className={styles.headerStatLabel}>SOLVED</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.headerStat}>
            <span className={styles.headerStatVal}>{QUESTS.length}</span>
            <span className={styles.headerStatLabel}>TOTAL</span>
          </div>
        </div>
      </div>

      {/* Topic progress */}
      <section className={styles.topicsSection}>
        <div className={styles.sectionLabel}>
          <BookOpen size={13} />
          <span>SKILL DOMAINS</span>
        </div>
        <div className={styles.topicsGrid}>
          {PRACTICE_TOPICS.map((t, i) => (
            <motion.div
              key={t.id}
              className={styles.topicCard}
              style={{ '--t-color': t.color }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className={styles.topicIcon}>{t.icon}</div>
              <div className={styles.topicMeta}>
                <div className={styles.topicName}>{t.name}</div>
                <div className={styles.topicProgress}>
                  <div className={styles.topicTrack}>
                    <motion.div
                      className={styles.topicFill}
                      style={{ background: t.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(t.solved / t.total) * 100}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05 + 0.2 }}
                    />
                  </div>
                  <span className={styles.topicCount}>{t.solved}/{t.total}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="SEARCH MISSIONS..."
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={12} className={styles.filterIcon} />
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`${styles.filterBtn} ${difficulty === d ? styles.filterActive : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          {TYPES.map(t => (
            <button
              key={t}
              className={`${styles.filterBtn} ${styles.typeBtn} ${type === t ? styles.filterActive : ''}`}
              onClick={() => setType(t)}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsRow}>
        <span className={styles.resultsCount}>
          <span style={{ color: 'var(--cyan)' }}>{filtered.length}</span> missions found
        </span>
      </div>

      {/* Quest grid */}
      {filtered.length > 0 ? (
        <motion.div
          className={styles.questGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.map(q => (
            <QuestCard key={q.id} quest={q} onClick={setSelectedQuest} />
          ))}
        </motion.div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◈</div>
          <div className={styles.emptyText}>NO MISSIONS MATCH YOUR FILTERS</div>
          <button className={styles.resetBtn} onClick={() => { setSearch(''); setDifficulty('ALL'); setType('ALL') }}>
            RESET FILTERS
          </button>
        </div>
      )}

      <MissionModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} onStart={handleStart} />
    </div>
  )
}
