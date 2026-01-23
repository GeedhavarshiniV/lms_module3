import LearningPolicy from "../models/LearningPolicy.js";

export const createPolicy = async (req, res) => {
  const policy = await LearningPolicy.create(req.body);
  res.status(201).json(policy);
};

export const updatePolicy = async (req, res) => {
  const policy = await LearningPolicy.findOneAndUpdate(
    { organizationId: req.params.orgId },
    req.body,
    { new: true }
  );
  res.json(policy);
};

export const getPolicy = async (req, res) => {
  const policy = await LearningPolicy.findOne({
    organizationId: req.params.orgId,
  });
  res.json(policy);
};
