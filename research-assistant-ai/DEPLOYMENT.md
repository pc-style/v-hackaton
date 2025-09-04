# Deployment Guide - Research Assistant AI

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/research-assistant-ai&env=AI_GATEWAY_API_KEY,AI_GATEWAY_BASE_URL&envDescription=Vercel%20AI%20Gateway%20credentials%20required)

### Option 2: Manual Deploy

1. **Fork/Clone Repository**
```bash
git clone https://github.com/your-username/research-assistant-ai
cd research-assistant-ai
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Vercel AI Gateway**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to AI Gateway section
   - Create a new Gateway
   - Copy the API key and Gateway URL

4. **Configure Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Add environment variables:
     - `AI_GATEWAY_API_KEY`: Your Gateway API key
     - `AI_GATEWAY_BASE_URL`: Your Gateway endpoint URL
     - `SERPER_API_KEY`: (Optional) For enhanced search

5. **Deploy**
```bash
vercel --prod
```

## 🔧 Environment Configuration

### Required Variables
```env
AI_GATEWAY_API_KEY=vg_xxxxxxxxxxxxxxxxxxxxxxxx
AI_GATEWAY_BASE_URL=https://gateway.ai.vercel.com/api/v1/your-team/your-gateway/openai
```

### Optional Variables
```env
SERPER_API_KEY=your_serper_key_for_enhanced_search
OPENAI_API_KEY=fallback_if_not_using_gateway
```

## 🎯 Hackathon Submission Checklist

### Pre-Submission
- [ ] Repository is public on GitHub
- [ ] All code is committed and pushed
- [ ] Environment variables configured in Vercel
- [ ] Application deploys successfully
- [ ] Demo works without errors
- [ ] README.md is comprehensive
- [ ] Demo video is recorded (if required)

### Vercel AI Gateway Requirements
- [ ] All AI model calls use Vercel AI Gateway
- [ ] Application is deployed on Vercel platform
- [ ] Gateway integration is properly configured
- [ ] Error handling includes Gateway fallbacks

### Submission Format
1. **GitHub Repository**: Public repo with complete source code
2. **Live Demo**: Working application deployed on Vercel
3. **Demo Video**: 60-90 second demonstration (if required)
4. **Documentation**: Clear README with setup instructions

## 🧪 Testing Your Deployment

### Smoke Tests
1. **Homepage Load**: Verify UI renders correctly
2. **Example Queries**: Test with provided example queries
3. **Error Handling**: Test with invalid inputs
4. **Mobile Responsive**: Check on different screen sizes

### Demo Mode Testing
The application includes comprehensive demo mode that works without API keys:
```bash
# Test locally without API keys
npm run dev
# Navigate to http://localhost:3000
# Try example queries - should work with simulated responses
```

### Production Testing
```bash
# Test with real API keys
export AI_GATEWAY_API_KEY="your_key"
export AI_GATEWAY_BASE_URL="your_url"
npm run dev
# Test with complex queries using real AI models
```

## 📊 Performance Optimization

### Vercel Optimizations
- Edge Functions for low latency
- Parallel agent execution
- Efficient token usage
- Smart caching strategies

### Monitoring
- Built-in performance tracking
- Token usage monitoring  
- Agent coordination metrics
- Error rate tracking

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**API Key Issues**
- Verify AI Gateway configuration in Vercel dashboard
- Check environment variable names match exactly
- Test with demo mode first (no keys required)

**Performance Issues**
- Monitor agent execution times
- Check parallel execution is working
- Verify Gateway response times

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
npm run dev
```

## 🏆 Hackathon Success Metrics

### Technical Innovation (25 points)
- ✅ Multi-agent orchestration system
- ✅ Parallel execution architecture  
- ✅ Novel agent specialization
- ✅ Production-ready implementation

### Creativity (25 points)
- ✅ Unique approach to AI assistance
- ✅ Beautiful agent visualization
- ✅ Creative synthesis capabilities
- ✅ Engaging user experience

### AI Gateway Integration (25 points)
- ✅ All AI calls through Gateway
- ✅ Proper error handling
- ✅ Optimized for Vercel platform
- ✅ Scalable architecture

### Presentation (25 points)
- ✅ Polished demo interface
- ✅ Clear documentation
- ✅ Professional presentation
- ✅ Open source contribution

## 🎬 Demo Video Outline

### Script (90 seconds)
1. **Hook** (10s): "What if AI assistants worked like research teams?"
2. **Problem** (15s): Limitations of single-agent systems
3. **Solution** (20s): Multi-agent coordination demo
4. **Live Demo** (35s): Complex query with real-time visualization
5. **Technical** (10s): Architecture and Vercel integration

### Recording Tips
- Use high-quality screen recording
- Clear, enthusiastic narration
- Show both UI and technical aspects
- Highlight Vercel AI Gateway usage
- End with clear call-to-action

## 🌟 Post-Hackathon

### Community Engagement
- Share on social media with #VercelAIGateway
- Write technical blog post about multi-agent architecture
- Present at AI/developer meetups
- Contribute to open source AI ecosystem

### Future Development
- Add more agent specializations
- Implement real-time streaming
- Build custom agent training
- Scale to enterprise use cases

---

**Ready to submit to the Vercel AI Gateway Hackathon!** 🎉