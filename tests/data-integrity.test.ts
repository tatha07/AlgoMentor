import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICE_PROBLEMS } from '../src/data/practiceProblems';
import { ASSESSMENT_QUESTIONS } from '../src/data/assessmentQuestions';
import { DSA_TOPICS } from '../src/data/dsaTopics';

describe('Data Integrity & Curriculum Tests', () => {
  test('All practice problems have valid schema and multilingual starter code', () => {
    assert.ok(PRACTICE_PROBLEMS.length > 0, 'Practice problems array must not be empty');

    for (const p of PRACTICE_PROBLEMS) {
      assert.ok(p.id && p.id.trim(), `Problem missing id: ${JSON.stringify(p)}`);
      assert.ok(p.title && p.title.trim(), `Problem ${p.id} missing title`);
      assert.ok(['easy', 'medium', 'hard'].includes(p.difficulty), `Problem ${p.id} invalid difficulty: ${p.difficulty}`);
      assert.ok(p.description && p.description.trim(), `Problem ${p.id} missing description`);
      assert.ok(p.examples && p.examples.length > 0, `Problem ${p.id} missing examples`);

      // Verify all 4 required programming languages are present in starter code
      assert.ok(p.starterCode.javascript?.trim(), `Problem ${p.id} missing JavaScript starter code`);
      assert.ok(p.starterCode.python?.trim(), `Problem ${p.id} missing Python starter code`);
      assert.ok(p.starterCode.cpp?.trim(), `Problem ${p.id} missing C++ starter code`);
      assert.ok(p.starterCode.java?.trim(), `Problem ${p.id} missing Java starter code`);

      // Verify hints and explanation
      assert.ok(p.progressiveHints && p.progressiveHints.length > 0, `Problem ${p.id} missing progressive hints`);
      assert.ok(p.solutionExplanation && p.solutionExplanation.trim(), `Problem ${p.id} missing solution explanation`);
      assert.ok(p.expectedComplexity?.time, `Problem ${p.id} missing time complexity`);
      assert.ok(p.expectedComplexity?.space, `Problem ${p.id} missing space complexity`);
    }
  });

  test('All assessment questions have valid structure and exactly one correct option', () => {
    assert.ok(ASSESSMENT_QUESTIONS.length > 0, 'Assessment questions array must not be empty');

    for (const q of ASSESSMENT_QUESTIONS) {
      assert.ok(q.id && q.id.trim(), `Question missing id: ${JSON.stringify(q)}`);
      assert.ok(q.question && q.question.trim(), `Question ${q.id} missing question text`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Question ${q.id} must have at least 4 options`);

      // Verify each option has id, text, boolean isCorrect, and explanation
      let correctCount = 0;
      for (const opt of q.options) {
        assert.ok(opt.id, `Question ${q.id} option missing id`);
        assert.ok(opt.text && opt.text.trim(), `Question ${q.id} option ${opt.id} missing text`);
        assert.ok(typeof opt.isCorrect === 'boolean', `Question ${q.id} option ${opt.id} isCorrect must be boolean`);
        assert.ok(opt.explanation && opt.explanation.trim(), `Question ${q.id} option ${opt.id} missing explanation`);
        if (opt.isCorrect) correctCount++;
      }

      assert.equal(
        correctCount,
        1,
        `Question ${q.id} must have exactly 1 correct option, found ${correctCount}`
      );
      assert.ok(q.testedConcept && q.testedConcept.trim(), `Question ${q.id} missing testedConcept`);
    }
  });

  test('All DSA curriculum topics have valid metadata, concepts, and code snippets', () => {
    assert.ok(DSA_TOPICS.length > 0, 'DSA Topics list must not be empty');

    for (const topic of DSA_TOPICS) {
      assert.ok(topic.id && topic.id.trim(), `Topic missing id: ${JSON.stringify(topic)}`);
      assert.ok(topic.title && topic.title.trim(), `Topic ${topic.id} missing title`);
      assert.ok(topic.description && topic.description.trim(), `Topic ${topic.id} missing description`);
      assert.ok(topic.concept && topic.concept.trim(), `Topic ${topic.id} missing concept`);
      assert.ok(topic.whyItMatters && topic.whyItMatters.trim(), `Topic ${topic.id} missing whyItMatters`);
      assert.ok(topic.visualExplanation && topic.visualExplanation.trim(), `Topic ${topic.id} missing visualExplanation`);
      assert.ok(topic.codeSnippets?.javascript?.trim(), `Topic ${topic.id} missing JavaScript code snippet`);
    }
  });
});
