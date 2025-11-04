class ResponseParser {
  static extractJSON(aiResponse) {
    try {
      return JSON.parse(aiResponse);
    } catch (e) {
      // Try markdown code block
      const codeBlockMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        try {
          return JSON.parse(codeBlockMatch[1]);
        } catch (e2) {
          // Continue
        }
      }
      
      // Try finding any JSON
      const jsonMatch = aiResponse.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e3) {
          // Continue
        }
      }
    }
    
    throw new Error('Could not extract valid JSON from AI response');
  }

  static validateAutomation(response) {
    const required = ['understanding', 'automation', 'generated_code', 'requirements'];
    
    for (const field of required) {
      if (!response[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (!response.automation.name || !response.automation.trigger) {
      throw new Error('Incomplete automation definition');
    }
    
    if (!response.generated_code.code) {
      throw new Error('No executable code generated');
    }
    
    return true;
  }

  static validateVisualRepresentation(response) {
    if (!response.ui_representation) {
      throw new Error('Missing ui_representation');
    }
    
    if (!Array.isArray(response.ui_representation.blocks) ||
        response.ui_representation.blocks.length === 0) {
      throw new Error('Visual representation must have at least one block');
    }
    
    for (const block of response.ui_representation.blocks) {
      if (!block.visual || !block.visual.icon || !block.visual.title) {
        throw new Error('Each block must have visual properties');
      }
    }
    
    return true;
  }

  static sanitizeCode(code) {
    const dangerous = [
      /rm\s+-rf\s+\//g,
      /:\(\)\{\|:&\};:/g,
      /eval\(/g,
      /Function\(/g,
      /child_process\.spawn/g
    ];
    
    for (const pattern of dangerous) {
      if (pattern.test(code)) {
        throw new Error(`Generated code contains dangerous pattern`);
      }
    }
    
    return code;
  }
}

module.exports = ResponseParser;
