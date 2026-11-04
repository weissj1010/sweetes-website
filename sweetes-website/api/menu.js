const { listAll, buildMenu } = require('./_square');

module.exports = async (req, res) => {
  try {
    const category = String(req.query.category || '').slice(0, 60);
    const objects = await listAll('ITEM,CATEGORY,IMAGE');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({ live: true, sections: buildMenu(objects, category) });
  } catch (e) {
    res.status(e.code === 'NO_TOKEN' ? 503 : 502).json({ error: e.message });
  }
};
